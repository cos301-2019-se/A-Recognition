import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import numpy as np
import face_recognition
import cv2


# Fetch the service account key JSON file contents
cred = credentials.Certificate('capstoneusers-b474f-firebase-adminsdk-rtpcf-4a8a042a1d.json')
firebase_admin.initialize_app(cred)

#Create the DB object
db = firestore.client()

#GET the collection Users for Facial Recognition
users_ref = db.collection(u'Users')

#docs now contain the data in Users
docs = users_ref.stream()

#
#@params model,video_capture,face_detector,open_eyes_detector,left_eye_detector,data,eyes_detected
#

def detect_and_display(model, video_capture, face_detector, open_eyes_detector, left_eye_detector, right_eye_detector, data, eyes_detected):
    #TODO Adrian figure out the videocapture

    #detect faces
    faces = face_detector.detectMultiScale(
        gray,
        scaleFactor=1.2,
        minNeighbors=5,
        minSize=(50, 50),
        flags=cv2.CASCADE_SCALE_IMAGE
    )

    #For all the faces detected do 
    for (x,y,w,h) in faces:
        #encode the face
        encoding = face_recognition.face_encodings(rgb, [(y, x+w, y+h, x)])[0]

        #TODO change this to make use of the encoding in the database
        
        # Compare the vector with all known faces encodings
        matches = face_recognition.compare_faces(data["encodings"], encoding)