import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import numpy as np
import os

# Fetch the service account key JSON file contents
path = os.path.dirname(os.path.realpath(__file__))
cred = credentials.Certificate(path + '/credentials.json')
firebase_admin.initialize_app(cred)

#Create the DB object
db = firestore.client()

#GET the collection Users for Facial Recognition
users_ref = db.collection(u'Users')

#docs now contain the data in Users
docs = users_ref.stream()

knownEncoding = []
encoding=[]
#Get all the data and sort so only emails remain
for doc in docs:
    knownEncoding.append(doc.to_dict())
for a in knownEncoding:
    encoding.append(a["Email"])

print(encoding)