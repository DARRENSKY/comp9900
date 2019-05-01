# -*- coding: utf-8 -*-
from __future__ import absolute_import

from flask import Flask

import v33
from flask_cors import CORS


def create_app():
    app = Flask(__name__, static_folder='static')
    CORS(app)
    app.register_blueprint(
        v33.bp,
        url_prefix='/v33')
    return app

if __name__ == '__main__':
    create_app().run(port=5001,debug=True)