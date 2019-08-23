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
from flask_cors import CORS
from PIL import Image
from io import BytesIO
import base64
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
CORS(app)

class AddEmployee(Resource):
    def post(self):
       
        encoding=[]
        print("ENCODING the dataset")
        temp =  (request.args.post('images'))
        #temp = temp.replace("data:image/jpeg;base64,", "")
        print(temp)
        # cmap = {'0': (255,255,255),
        #         '1': (0,0,0)}
        # data = [cmap[letter] for letter in temp ]
        # img = Image.new('RGB', (8, len(temp)//8), "white")
        # img.putdata(data)
        # img.show()      
        # # tempDecoded =  base64.b64decode(temp)
        # imgfile = BytesIO(base64.decodestring(temp))
        # f = Image.open(imgfile)  
      
        try:
            image = cv2.imread(img)
            # Convert it from BGR to RGB
            #Because opencv uses RGB
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # detect face in the image and get its location (square boxes coordinates)
            boxes = face_recognition.face_locations(image, model='hog')

            # Encode the face into a 128-d embeddings vector
            encoding.append(np.array(face_recognition.face_encodings(image,boxes)[0]).tolist())
            
            if len(encoding) > 0 :
                #Create an array of encoding objects
                arr=[]
                for enc in encoding:
                    arr.append({"encoding":enc})
                user = {
                    u'Name': (request.args.get('name')),
                    u'Surname':(request.args.get('surname')),
                    u'Title': (request.args.get('title')),
                    u'image_vector':arr,
                    u'Email':(request.args.get('email'))
                }
                # Add the new user to the database
                users_ref.document((request.args.get('name'))).set(user)
            if user:
                return True
        except TypeError:
            return "An error occured while trying to encode the image or saving to the database"

api.add_resource(AddEmployee,'/add')#Route to use

if __name__ == '__main__':
     app.run(port='2999')
