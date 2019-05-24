import face_recognition
import base64
import numpy as np
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from flask import Flask, request
from flask_restful import Resource, Api

# Fetch the service account key JSON file contents
cred = credentials.Certificate('capstoneusers-b474f-firebase-adminsdk-rtpcf-4a8a042a1d.json')

firebase_admin.initialize_app(cred)
#Create the DB object
db = firestore.client()
#GET the collection Users for Facial Recognition
users_ref = db.collection(u'Users')

##################
#Create the stuff for flask
app = Flask(__name__)
api = Api(app)
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response
##################
class User(Resource):
    def get(self,name,surname,title,imageName):#registerUser(name,surname,title,imageName):
        #######
        #Let the front end save the image and then just send the name of the
        #image to this function with its extention
        #######

        #Get data from parameters
        # json_data = request.get_json(force=True)
        # name=json_data['name']
        # surname=json_data['surname']
        # title=json_data['title']
        # imageName = json_data['imageName']

        #Create an encoding array
        encoding=[]
        #generate the encoding
        encoding.append(np.array(face_recognition.face_encodings(face_recognition.load_image_file("./"+imageName),num_jitters=10)[0]).tolist())

        #Now we have all the data necessary 
        #Just need to add it to an object
        user = {
            u'Name': name,
            u'Surname': surname,
            u'Title': title,
            u'image_vector': encoding[0]
        }
        #then add it to the collection
        users_ref.document(name).set(user)
        return

#registerUser("Richard","McFadden","Mr","test1.jpg")

##################################################
# More flask stuff
api.add_resource(User, '/registerUser/<name>/<surname>/<title>/<imageName>') # Route_1
if __name__ == '__main__':
     app.run(port='5002')
##################################################
