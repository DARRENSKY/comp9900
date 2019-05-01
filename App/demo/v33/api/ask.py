# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function

from flask import request, g

from . import Resource
from .. import schemas
import requests
from flask import Flask,jsonify
from flask import Response

from .localDB import localDB
from .helper import jaccard_key_socre,wikifunction,getRelevent,addLineFeed,filterFuc,getChapterDetails,getGreetings,getRelationAnswer,captalizeFCS,messageType
import json
import pymongo

mlabURI="mongodb://darren:Qq103171@ds133876.mlab.com:33876/mydatabase"




class Ask(Resource):

    def post(self):
        # Get the question and zid from user (question,zid)
        messageDict = request.json.get("message")

        print(messageDict)
        strToDict = json.loads(messageDict)

        # Extract the question
        message = strToDict
        # Process three different types register,login,history
        if "type" in message:
            if message["type"]:
                answers = messageType(message)
                return Response(response=json.dumps(answers))

        # Extract message and zid
        message=strToDict["message"]
        zid=strToDict["zid"]

        # If zid exits, return previous history
        if zid!="":
            # myclient = pymongo.MongoClient("mongodb://localhost:27017/")
            myclient = pymongo.MongoClient(mlabURI)
            db=myclient.get_database("mydatabase")
            # db=client
            mydb = db["comp9444"]
            mycol = mydb["zidPass"]
            newUser = {}
            for x in mycol.find():
                if x["_id"] == zid:
                    newUser["password"] = x["password"]
                    newUser["msgarray"] = x["msgarray"]
                    newUser["rsparray"] = x["rsparray"]

        # Greeting rule-based
        reply = getGreetings(message)

        # Relation answers
        relation = getRelationAnswer(message)

        if reply!="[ERR: No Reply Matched]":
            dict = {"description": [], "image": [], "related": [], "relevantChapter": [],"moreInformation":[]}
            dict["description"]=[reply]
            if zid!="":
                newUser["msgarray"].append(message)
                newUser["rsparray"].append(dict)
                myquery = {"_id": zid}
                newvalues = {"$set": newUser}
                x = mycol.update_one(myquery, newvalues, upsert=True)
            # update zid history - add greeting reply to database
            return Response(response=json.dumps(dict))
        # Relation not equal empty
        elif relation!=[]:
            # Get relation answers Correct or Incorrect
            dict = {"description": [], "image": [], "related": [], "relevantChapter": [],"moreInformation":[]}
            if relation[0]=="Yes":
                dict["description"] = [relation[0]]
            else:
                dict["description"] = [relation[0]]
                dict["moreInformation"] = relation[1]
                dict = addLineFeed(dict)
            print(dict)
            if zid!="":
                newUser["msgarray"].append(message)
                newUser["rsparray"].append(dict)
                myquery = {"_id": zid}
                newvalues = {"$set": newUser}
                x = mycol.update_one(myquery, newvalues, upsert=True)
            # update zid history - add relation answers to database
            return Response(response=json.dumps(dict))

        # Other types of questions can be answered by Information retrieval
        else:
            # Get result from NLP
            result = requests.get('https://api.wit.ai/message?v=20190419&q={}'.format(message),
                                  headers = {'Authorization': 'Bearer 4WVEOWBMMHQCLHC5X2ZL5X5JUXHZF2BJ'})
            jsonResult = result.json()

            # If input can not be found, return "No Input"
            if "error" in jsonResult:
                answers=responseNoInput()
                return answers
            # If the input has been found, intent or key can be returned
            if 'intent' in jsonResult['entities']:
                if jsonResult['entities']['intent'][0]['value'] == 'GetValue':
                    witValues=jsonResult['entities']
                    # Keywords have been extracted successfully
                    if "key" in jsonResult['entities']:
                        question = jsonResult['entities']['key'][0]['value']

                    else:
                        question = message.replace("?", "")
                        if "unsupervised learning" in question.lower():
                            question="unsupervised learning"
                    # Lower keywords
                    question = question.lower()
                    # Determiner whether the definition is or not
                    if "qualifier" in witValues:
                        answers = responseDefintion(question)
                    else:
                        answers = responseNoDefintion(question)
                        print("answers=", answers)

                    # If zid is not null, the history of answers will updated
                    if zid != "":
                        newUser["msgarray"].append(message)
                        newUser["rsparray"].append(answers)
                        myquery = {"_id": zid}
                        newvalues = {"$set": newUser}
                        x = mycol.update_one(myquery, newvalues, upsert=True)
                    return Response(response=json.dumps(answers))
            # Solve the problem that intent can not be figured out
            else:
                if 'key' in jsonResult['entities']:
                    question = jsonResult['entities']['key'][0]['value']
                    question = question.lower()
                    answers=responseNoDefintion(question)
                    # If zid is not null, the history of answers will updated
                    if zid != "":
                        newUser["msgarray"].append(message)
                        newUser["rsparray"].append(answers)
                        myquery = {"_id": zid}
                        newvalues = {"$set": newUser}
                        x = mycol.update_one(myquery, newvalues, upsert=True)
                    return Response(response=json.dumps(answers))

# Response to input nothing
def responseNoInput():
    dict = {"description": [], "image": [], "related": [], "relevantChapter": [],"moreInformation":[]}
    dict["description"]="Please input correct contents"
    return Response(response=json.dumps(dict))

# Response to the definition question
def responseDefintion(question):

    dict = {"description": [], "image": [], "related": [], "relevantChapter": [],"moreInformation":[]}
    Definition = []
    # Keywords in database
    if question in localDB:
        Definition = getDefinitionFromDataBase(question)
        dict['description'] = Definition
        dict = addLineFeed(dict)
        return dict
    # Filter function to match keywords
    elif filterFuc(question)!="":
        filterKey=filterFuc(question)
        Definition = getDefinitionFromDataBase(filterKey)
        dict['description'] = Definition
        dict = addLineFeed(dict)
        return dict
    # Jaccard function to match keywords
    else:
        jaccard_key,jaccard_score=jaccard_key_socre(question)
        if jaccard_score>=0.75:
            # print("using jaccard")
            Definition = getDefinitionFromDataBase(jaccard_key)
            dict['description'] = Definition
            dict = addLineFeed(dict)
        # Wiki function to answer question which is not in lecture notes
        else:
            wiki_definition = wikifunction(question)
            if wiki_definition != 'no_matching':
                # print("using wiki")
                Definition.append(wiki_definition)
            dict['description'] = Definition
            dict = addLineFeed(dict)
        return dict

# Response to all information about question
def responseNoDefintion(question):
    dict = {"description": [], "image": [], "related": [], "relevantChapter": [],"moreInformation":[]}
    Definition = []
    # Keywords in database
    if question in localDB:
        # print("using localDB")
        return getNoDefinitionFromDataBase(question)

    # Filter function to match keywords
    elif filterFuc(question)!="":
        # print("using filterTable")
        filterKey=filterFuc(question)
        return getNoDefinitionFromDataBase(filterKey)

    # Jaccard function to match keywords
    else:
        jaccard_key, jaccard_score = jaccard_key_socre(question)
        if jaccard_score >= 0.75:
            # print("using jaccard")
            return getNoDefinitionFromDataBase(jaccard_key)

        # Wiki function to answer question which is not in lecture notes
        else:
            wiki_definition = wikifunction(question)
            if wiki_definition != 'no_matching':
                # print("using wiki")
                Definition.append(wiki_definition)
            dict['description'] = Definition
            dict = addLineFeed(dict)
            return dict


# Definition can be extracted from database
def getDefinitionFromDataBase(question):
    Definition = []
    # Keywords in database
    if localDB[question]["definition"] != "":
        dbDefinition = localDB[question]["definition"]
        Definition.append(dbDefinition)
    else:
        dbDefinition = localDB[question]["description"]
        dbDefinition = captalizeFCS(dbDefinition)
        Definition = dbDefinition
    return Definition

# All relevant information can be extracted from database
def getNoDefinitionFromDataBase(question):
    dict = {"description": [], "image": [], "related": [], "relevantChapter": [],"moreInformation":[]}
    Description = []
    Definition = []
    # Keywords in database
    if localDB[question]['definition'] != "":
        dbDefinition = localDB[question]['definition']
        Definition.append(dbDefinition)
    if localDB[question]["description"] != []:
        dbDescription = localDB[question]["description"]
        Description = dbDescription
    dict['description'] = captalizeFCS(Definition + Description)
    dict["image"] = localDB[question]["image"]
    dict["related"] = getRelevent(question)
    dict["relevantChapter"]= getChapterDetails(question)
    dict = addLineFeed(dict)
    return dict





