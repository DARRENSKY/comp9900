# -*- coding: utf-8 -*-
from .localDB import localDB
import inflection
from nltk.corpus import stopwords
from .relevantTable import relevantTable
from .chapterTable import chapterTB
from .filterData import filterTB
from .belongTB import belongTB
from rivescript import RiveScript
import os
import wikipedia
import pymongo

mlabURI="mongodb://darren:Qq103171@ds133876.mlab.com:33876/mydatabase"

# Process three different types register,login,history
def messageType(message):
    # connect database
    # myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    myclient = pymongo.MongoClient(mlabURI)
    db=myclient.get_database("mydatabase")
    # db = client
    mydb = db["comp9444"]
    mycol = mydb["zidPass"]

    # Determine whether type exists or not
    if message["type"]:

        # Type equals register
        if message["type"] == "register":
            newUser = {}
            zid = message['zid']
            password = message['password']
            msgarray = []
            rsparray = []
            newUser["_id"] = zid
            newUser["password"] = password
            newUser["msgarray"] = msgarray
            newUser["rsparray"] = rsparray
            registerFlag = False

            # Traverse the zidPass Table to see if the user exists or not
            for x in mycol.find():
                if x["_id"] == zid:
                    registerFlag = True
            if registerFlag:
                return "false"
            # If new user, it will be inserted to database
            else:
                x = mycol.insert_one(newUser)
                return "success"
        # Type equals login
        elif message["type"] == "login":
            loginFlag = False
            zid = message['zid']
            password = message["password"]
            # Traverse the zidPass Table to check zid and password
            for x in mycol.find():
                if x["_id"] == zid:
                    if x["password"] == password:
                        loginFlag = True
            if loginFlag:
                return "login"
            else:
                return "false"
        # Type equals history
        else:
            zid = message['zid']
            # Traverse the zidPass Table to get the history of the user
            for x in mycol.find():
                if x["_id"] == zid:
                    return x
            return "id not exist"


# capitalizes the first letter of each sentence
def captalizeFCS(description):
    captalDescription=[]
    for i in description:
        if i!="":
            # capitalizes the first letter and keep other words
            firstWord=i[0].upper()
            otherWord=i[1:]
            sentence=firstWord+otherWord
            captalDescription.append(sentence)
    return captalDescription


# Solve the affiliation problem e.g. Is decision tree belong to supervised learning?
def GetRelated(test):
    type = ''
    flag=""

    # Search for affiliation keywords
    if "belongs to" in test or "belong to" in test or "belonging to" in test or "includes" in test or "include" in test or "including" in test or "is a part of" in test or "is part of" in test or "are parts of" in test or "is subject to" in test or "is subjects to" in test or "are subjects to" in test or "are subject to" in test:
        flag="yes"
        type = "Relation"
    if "not belongs to" in test or "not belong to" in test or "not belonging to" in test or "not includes" in test or "not include" in test or "not including" in test or "is not a part of" in test or "is not part of" in test or "are not parts of" in test or "is not subjects to" in test or "is not subject to" in test or "are not subjects to" in test or "are not subject to" in test or "no belongs to" in test or "no belong to" in test or "no belonging to" in test or "no includes" in test or "no include" in test or "no including" in test or "is no a part of" in test or "is no part of" in test or "are no parts of" in test or "is no subject to" in test or "is no subjects to" in test or "are no subjects to" in test or "are no subject to" in test:
        flag="no"
        type = "Relation"

    children = ""
    father = ""
    # Get children and father set
    if type == "Relation":
        words = test.split()
        for i in range(len(words)):
            if "?" in words[i]:
                words[i] = words[i].split("?")
                words[i] = words[i][0]

        while '' in words:
            words.remove('')
        if words[0] == "Is" or words[0] == "IS" or words[0] == "is" or words[0] == "are" or words[0] == "Are" or words[0] == "ARE":
            words.pop(0)
        for i in range(len(words)):
            if words[i] == "belongs" or words[i] == "belong" or words[i] == "belonging":
                for j in range(0,i):
                    children += words[j] + ' '
                if words[i+1] == "to":
                    for x in range(i+2,len(words)):
                        father += words[x] + ' '
                else:
                    for x in range(i+1,len(words)):
                        father += words[x] + ' '
            if words[i] == "includes" or words[i] == "include" or words[i] == "including":
                for j in range(0,i):
                    father += words[j] + ' '
                if words[i+1] == "of":
                    for x in range(i+2,len(words)):
                        children += words[x] + ' '
                else:
                    for x in range(i+1,len(words)):
                        children += words[x] + ' '
            if words[i] == "is" or words[i] == "are":
                for j in range(0,i):
                    children += words[j] + ' '
                if words[i+1] == "a" and words[i+2] == "part" and words[i+3] == "of":
                    for x in range(i+4,len(words)):
                        father += words[x] + ' '

                elif words[i+1] == "part" and words[i+2] == "of":
                    for x in range(i+3,len(words)):
                        father += words[x] + ' '

                elif words[i+1] == "parts" and words[i+2] == "of":
                    for x in range(i+3,len(words)):
                        father += words[x] + ' '
                elif words[i+1] == "subject" and words[i+2] == "to":
                    for x in range(i+3,len(words)):
                        father += words[x] + ' '
                elif words[i+1] == "subjects" and words[i+2] == "to":
                    for x in range(i+3,len(words)):
                        father += words[x] + ' '
                else:
                    for x in range(i+1,len(words)):
                        father += words[x] + ' '

        # Process children and father
        children = children[:-1]
        father = father[:-1]
        if "," in children:
            children = children.split(",")
        elif " and " in children:
            children = children.split(" and ")
        elif " or " in children:
            children = children.split(" or ")
        else:
            children = children.split(".")
        if "," in father:
            father = father.split(",")
        elif " and " in father:
            father = father.split(" and ")
        else:
            father = father.split(".")
        for i in range(len(children)):
            if " and " in children[i]:
                children[i] = children[i].split(" and ")
                a = children[i][0]
                b = children[i][1]
                children.insert(i,a)
                children.insert(i+1,b)
                children.pop(i+2)
            elif " or " in children[i]:
                children[i] = children[i].split(" or ")
                a = children[i][0]
                b = children[i][1]
                children.insert(i, a)
                children.insert(i + 1, b)
                children.pop(i + 2)
            elif " not" in children[i]:
                children[i] = children[i].split(" not")
                a = children[i][0]
                #b = children[i][1]
                children.insert(i, a)
                #children.insert(i + 1, b)
                children.pop(i + 1)
            elif " no" in children[i]:
                children[i] = children[i].split(" no")
                a = children[i][0]
                #b = children[i][1]
                children.insert(i, a)
                #children.insert(i + 1, b)
                children.pop(i + 1)
        for i in range(len(children)):
            if children[i][0] == ' ':
                children[i] = children[i][1:]
        for i in range(len(father)):
            if " and " in father[i]:
                father[i] = father[i].split(" and ")
                a = father[i][0]
                b = father[i][1]
                father.insert(i,a)
                father.insert(i+1,b)
                father.pop(i+2)
            elif " or " in father[i]:
                father[i] = father[i].split(" or ")
                a = father[i][0]
                b = father[i][1]
                father.insert(i,a)
                father.insert(i+1,b)
                father.pop(i+2)
        for i in range(len(father)):
            if father[i][0] == ' ':
                father[i] = father[i][1:]
            if father[i][-1] == ' ':
                father[i] = father[i][:-1]
        for i in range(len(children)):
            if children[i][0] == ' ':
                children[i] = children[i][1:]
            if children[i][-1] == ' ':
                children[i] = children[i][:-1]
        relation = []
        relation.append(children)
        relation.append(father)
        relation.append(flag)
        return relation
    else:
        return []

# Return the correct by processing the children and father set
def getRelationAnswer(message):

    list=GetRelated(message)
    if list!=[]:

        # Separate children father and flag
        flag = list[-1:][0]
        contents = list[:-1]
        children0 = contents[0]
        fathers0 = contents[1]
        children = []
        fathers = []
        relation_dict = belongTB
        result = []

        for i in children0:
            temp = process(i)
            children.append((temp))

        for i in fathers0:
            temp = process(i)
            fathers.append((temp))

        for child in children:
            if child in relation_dict:
                for value in relation_dict[child]:
                    print(value)
                    if value == fathers[0].lower():
                        result.append(child)
        # Keep father and children
        more_details=[]
        for child in children:
            more_details.append(child)
        for father in fathers:
            more_details.append(father)

        # Return the answer according to affiliation table
        if len(result)!=0:
            if flag=="yes":
                answer="Correct"
            else:
                answer="Incorrect"
        else:
            if flag=="yes":
                answer="Incorrect"
            else:
                answer="Correct"
        return (answer,more_details)
    else:
        return []


# Process greeting using Riverscript
def getGreetings(test):
    bot = RiveScript()
    current_directory = os.getcwd()
    brain = current_directory + "/v33/api/brain"
    bot.load_directory(brain)
    bot.sort_replies()
    reply = bot.reply("localuser", test)
    return reply


# Return wiki explanation if some query can not be answered from our lecture notes e.g. some questions are not relevant to these courses
def wikifunction(query):
    try:
        my_string = wikipedia.page(query)
        wiki1=my_string.title.lower()
        if "-" in wiki1:
            wiki1=wiki1.replace("-"," ")
            score=jaccard_similarity(wiki1,query.lower())
            if score>=0.75:
                my_string = my_string.content
                my_string = my_string.split('\n')[0]
                return my_string
        if my_string.title.lower() != query.lower():
            return 'no_matching'
        my_string = my_string.content
        my_string = my_string.split('\n')[0]
        return my_string
    except:
        if wikipedia.exceptions.PageError:
            return 'no_matching'

# Jaccard-similarity function to get relevant score between two sentence
def jaccard_similarity(string1, string2):
    list1 = [word for word in string1.split() if word not in stopwords.words('english')]
    # list1 = [singularize(plural) for plural in list1]
    list1 = [inflection.singularize(plural) for plural in list1]
    list1 = list(set(list1))
    list2 = [word for word in string2.split() if word not in stopwords.words('english')]
    # list2 = [singularize(plural) for plural in list2]
    list2 = [inflection.singularize(plural) for plural in list2]
    list2 = list(set(list2))

    intersection = len(list(set(list1).intersection(list2)))
    union = (len(list1) + len(list2)) - intersection
    return float(intersection / union)


# Get the score of relevant information from database using jaccard-similarity function
def jaccard_key_socre(question):
    # print(question)
    jaccard_key=""
    jaccard_score = 0
    for key in localDB:
        current_score=jaccard_similarity(question.lower(),key)
        if current_score>jaccard_score:
            jaccard_key=key
            jaccard_score=current_score
    return jaccard_key,jaccard_score

# Select the most relevant answers from the highest score
def getRelevent(question):
    relevantTB=[]
    for key, val in relevantTable.items():
        results = jaccard_similarity(question.lower(), key.lower())
        if results >= 0.75:
            relevantTB=val
    return relevantTB

# Return the some relevant words in the same chapter
def getChapterDetails(question):
    chapters=[]
    if question in localDB:
        chapter=localDB[question]["chapter"]
        if chapter in chapterTB:
            chapters=chapterTB[chapter]
    return chapters

# Filter Function helps to solve the problem of different order of some words
def filterFuc(question):
    key = question
    key = key.lower()
    filter_word = ['a', 'of', 'about', 'the', 'as', 'and', 'on', 'with', 'for', 'to', 'by', 'are']
    useful_string = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
                     'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '0', '3', '4', '5', '6', '7', '8', '9']
    for string in key:
        if string not in useful_string:
            key = key.replace(string, ' ')
    key = ' '.join(key.split())

    key_list = key.split(' ')
    why_list = []
    for string in key_list:
        if string in filter_word:
            why_list.append(string)

    for i in why_list:
        key_list.remove(i)

    if 's' in key_list:
        key_list.remove('s')


    for plural in key_list:
        if plural != "vs":
            # key_list[key_list.index(plural)] = singularize(plural)
            key_list[key_list.index(plural)] = inflection.singularize(plural)
    key = ' '.join(key_list)

    if key in filterTB:

        return filterTB[key]
    else:
        return ""


# Add line feed to give better presentation
def addLineFeed(test_object):
    temp = ''
    for i in test_object['description']:
        a = i + '\n'
        temp = temp + a
    test_object['description'] = [temp]
    return test_object


# Remove unimportant words and save useful word from extracted keywords
def process(key):
    key = key.lower()
    filter_word = ['a', 'of', 'about', 'the', 'as', 'and', 'on', 'with', 'for', 'to', 'by', 'are']
    useful_string = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
                     't',
                     'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '0', '3', '4', '5', '6', '7', '8', '9']
    for string in key:
        if string not in useful_string:
            key = key.replace(string, ' ')
    key = ' '.join(key.split())
    key_list = key.split(' ')

    why_list = []
    for string in key_list:
        if string in filter_word:
            why_list.append(string)

    for j in why_list:
        key_list.remove(j)

    if 's' in key_list:
        key_list.remove('s')

    for plural in key_list:
        if plural != "vs":
            # key_list[key_list.index(plural)] = singularize(plural)
            key_list[key_list.index(plural)] = inflection.singularize(plural)
    key = ' '.join(key_list)
    return key
