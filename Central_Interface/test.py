import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import numpy as np

# Fetch the service account key JSON file contents
cred = credentials.Certificate('credentials.json')
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