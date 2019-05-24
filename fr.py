import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import numpy as np
import face_recognition
from flask import Flask, request
from flask_restful import Resource, Api
import base64
import json

# Fetch the service account key JSON file contents
cred = credentials.Certificate('capstoneusers-b474f-firebase-adminsdk-rtpcf-4a8a042a1d.json')
firebase_admin.initialize_app(cred)

#Create the DB object
db = firestore.client()

#GET the collection Users for Facial Recognition
users_ref = db.collection(u'Users')

#docs now contain the data in Users
docs = users_ref.stream()

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

##################
#Variables
encodings=[]
title=[]
surname= []
##################

def fillArrays():
    for doc in docs:
        #print(u'{} => {}'.format(doc.id, doc.to_dict()))
        encodings.append(np.asarray(doc.to_dict().get("image_vector")))
        title.append(doc.to_dict().get("Title"))
        surname.append(doc.to_dict().get("Surname"))
        return True
        #print(encodings)

#@app.route('/authenticate',methods=["POST"])
class authenticate(Resource):
    def get(self,jsonOBj):
        #################
        #Let frontend save image and just send in the imageName.extention
        #################
        # #save base64
        # data = jsonOBj
        # dec_img =base64.decodestring(data['image'])
        # #create a name for the file. example userIDCounter.jpg thus 01.jpg
        # st = "testdemo.jpg"
        # #save the binary as an image to use
        # with open(st, 'wb') as f:
        #     f.write(dec_img)

        #Fill all the arrays needed
        fillArrays()

        #Generate encoding for the image sent in 
        imagetoTest = face_recognition.load_image_file(jsonOBj) #Image they send us encoded
        image_encoding = face_recognition.face_encodings(imagetoTest)[0]

        #check to see if image is in db
        counter =0
        for e in encodings:
            results = (face_recognition.compare_faces([e],image_encoding,tolerance=0.6))
            for s in results:
                if(s == True):
                    user = {
                        "success":"True",
                        "Title":title[counter],
                        "Surname":surname[counter]
                    }
                    return user        
            counter = counter + 1
        return {"success":"False"}   

#print(authenticate("5.jpg"))
#################################################
#Unit test code
def test(jsonOBj):
    #Fill all the arrays needed
    fillArrays()

    #Generate encoding for the image sent in 
    imagetoTest = face_recognition.load_image_file(jsonOBj) #Image they send us encoded
    image_encoding = face_recognition.face_encodings(imagetoTest)[0]

    #check to see if image is in db
    counter =0
    for e in encodings:
        results = (face_recognition.compare_faces([e],image_encoding,tolerance=0.6))
        for s in results:
            if(s == True):
                user = {
                    "success":"True",
                    "Title":title[counter],
                    "Surname":surname[counter]
                }
                return user        
        counter = counter + 1
    return {"success":"False"}  
def registerTest(name,surname,title,imageName):#registerUser(name,surname,title,imageName):
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
            u'Title': title
        }
        if(name!=""):
            return user
        else:
            False
##################################################
# More flask stuff
api.add_resource(authenticate, '/authenticate/<jsonOBj>') # Route_1
if __name__ == '__main__':
     app.run(port='5030')
##################################################