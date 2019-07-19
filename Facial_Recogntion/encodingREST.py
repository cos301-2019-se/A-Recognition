## 
# Filename: encodingREST.py
# Version: V1.0
# Author: Richard McFadden
# Project name: A-Recognition (Advance)
# Organization: Singularity
# Funtional description: Provides same functionality as encoding.py but as a RESTful api

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import numpy as np
import face_recognition
import cv2
from flask import Flask, request
from flask_restful import Resource, Api
from flask import *

# Fetch the service account key JSON file contents
cred = credentials.Certificate('credentials.json')
firebase_admin.initialize_app(cred)

#Create the DB object
db = firestore.client()

#GET the collection Users for Facial Recognition
users_ref = db.collection(u'Users')

#docs now contain the data in Users
docs = users_ref.stream()

app = Flask(__name__)
api = Api(app)

class Emails(Resource):
    def get(self):
        try:
            knownEncoding = []
            encoding=[]

            #Get all the data and sort so only emails remain
            for doc in docs:
                knownEncoding.append(doc.to_dict())
            for a in knownEncoding:
                encoding.append(a["Email"])

            return jsonify(encoding)
        except TypeError:
            return "An error occured while trying to encode the image or saving to the database"

api.add_resource(Emails,'/emails')#Route to use

if __name__ == '__main__':
     app.run(port='2999')
