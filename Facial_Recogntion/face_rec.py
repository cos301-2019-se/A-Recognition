## 
# Filename: face_rec.py
# Version: V1.0
# Author: Adrian le Grange, Richard McFadden
# Project name: A-Recognition (Advance)
# Organization: Singularity
# Funtional description: A subsystem used to provide facial detection and recognition to other subsystems

import os
import cv2
import face_recognition
import numpy as np
from tqdm import tqdm
from collections import defaultdict
from imutils.video import VideoStream
from eye_status import * 
from encoding import *
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import requests
import json
import time

db = firestore.client()

#GET the collection Users for Facial Recognition
users_ref = db.collection(u'Users')

#docs now contain the data in Users
docs = users_ref.stream()

##
#Function that returns a tuple containing all needed models and data that is used for the facial recognition
#
#@return: Tuple containing: The open/closed eye model, the face-detection model, the model to detect open eyes, left-eye detection model, right-eye detection model, the video stream
def init():
    #Load models to detect faces and features of them
    dataset = 'faces'

    #face_detector = cv2.CascadeClassifier('lbpcascade_frontalface.xml')
    face_detector = cv2.CascadeClassifier('haarcascade_frontalface_alt.xml')
    open_eyes_detector = cv2.CascadeClassifier('haarcascade_eye_tree_eyeglasses.xml')
    left_eye_detector = cv2.CascadeClassifier('haarcascade_lefteye_2splits.xml')
    right_eye_detector = cv2.CascadeClassifier('haarcascade_righteye_2splits.xml')

    #Open the first available webcam index
    print("[LOG] Opening webcam ...")
    for x in range(-10, 10):
        video_capture = VideoStream(src=x).start()
        if not (video_capture is None or not video_capture.stream.isOpened()):
            print("[LOG] Webcam opened. (Index ",x, ")")
            break
    
    #Quit if no webcam could be opened
    if video_capture is None or not video_capture.stream.isOpened():
        print("[ERR] Webcam could not be opened. Exiting...")
        quit()

    #Load our model that classifies open or closed eyes ('model.h5')
    model = load_model()

    return (model,face_detector, open_eyes_detector, left_eye_detector,right_eye_detector, video_capture) 
##
#Function that validate whether a user may proceed
#
#@param email: A string containing an email
#@param room:The room that was booked
def validate(email,room = "Room 9"):
    urlToSend = 'http://localhost:3000/validateUserHasBooking?email='+email+''+'&room=Room 9'
    allowedResponse = requests.get(url=urlToSend) 
##
#Function that determines if a person has blinked recently
#
#@param history: A string containing a sequence of past eye statuses
#@param maxFrames: The maximum number of successive frames where an eye is closed
#@return: Return a boolean indicating if person has blinked
def isBlinking(history, maxFrames):
    """ @history: A string containing the history of eyes status 
         where a '1' means that the eyes were closed and '0' open.
        @maxFrames: The maximal number of successive frames where an eye is closed """
    for i in range(maxFrames):
        pattern = '1' + '0'*(i+1) + '1'
        if pattern in history:
            return True
    return False

##
#Function that detects faces and features and displays the result as video feed
#
#@param model: The model to be used for determining eye status
#@param video_capture: The video stream to process
#@param face_detector: The model used to detect a person's face
#@param open_eyes_detector: The model used to determine if a persons eyes is open
#@param left_eye_detector: The model used to locate a person's left eye
#@param right_eye_detector: The model used to locate a person's right eye
#@param data: The array storing all the facial data and emails of registered people (Actually a subset of the people)
#@param eyes_detected: Array that holds the history of a person's eye status
#@return: A manipulated frame
def detect_and_display(model, video_capture, face_detector, open_eyes_detector, left_eye_detector, right_eye_detector, data, eyes_detected):
        #Grab a single frame from the video stream
        frame = video_capture.read()

        #Resize the frame to something reasonable
        frame = cv2.resize(frame, (0, 0), fx=0.6, fy=0.6)

        #Save a RGB and grayscale copy of the frame
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        #Pass the grayscale image to our face-detection model to strip out all faces
        faces = face_detector.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=5, minSize=(50, 50), flags=cv2.CASCADE_SCALE_IMAGE)

        #For each detected face
        for (x,y,w,h) in faces:
            #Encode the face into a 128-d embeddings vector
            encoding = face_recognition.face_encodings(rgb, [(y, x+w, y+h, x)])[0]
            #For now we don't know the user's name
            name = "Unknown"
            global email
            emails = []
            temp = data['user']

            #Compare the vector with all known faces encodings
            for e in temp:
                secondTemp = e['image_vector'][0]['encoding']
                matches = face_recognition.compare_faces([secondTemp], encoding)
                if True in matches:
                    first_match_index = matches.index(True)
                    name = e["Name"]
                    emails.append(e['Email'])
                    #print(name)                    

            #Store the cropped face
            face = frame[y:y+h,x:x+w]
            gray_face = gray[y:y+h,x:x+w]

            eyes = []
            
            #We now detect the user's eyes
            open_eyes_glasses = open_eyes_detector.detectMultiScale(gray_face, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30), flags = cv2.CASCADE_SCALE_IMAGE)
            
            #If open_eyes_detector detects eyes, they are open
            if len(open_eyes_glasses) == 2:
                eyes_detected[name]+='1'
                for (ex,ey,ew,eh) in open_eyes_glasses:
                    cv2.rectangle(face,(ex,ey),(ex+ew,ey+eh),(0,255,0),2)
            
            #Else we try to detect individual eyes (Detects both open and closed eyes)              
            else:
                #Slpit the face into a left and right side
                left_face = frame[y:y+h, x+int(w/2):x+w]
                left_face_gray = gray[y:y+h, x+int(w/2):x+w]

                right_face = frame[y:y+h, x:x+int(w/2)]
                right_face_gray = gray[y:y+h, x:x+int(w/2)]

                #Detect the left eye
                left_eye = left_eye_detector.detectMultiScale(left_face_gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30), flags = cv2.CASCADE_SCALE_IMAGE)

                #Detect the right eye
                right_eye = right_eye_detector.detectMultiScale(right_face_gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30), flags = cv2.CASCADE_SCALE_IMAGE)

                eye_status = '0' # we suppose the eyes are open

                # For each eye check wether the eye is closed.
                # If one is closed we conclude the eyes are closed
                for (ex,ey,ew,eh) in right_eye:
                    color = (0,255,0)
                    pred = predict(right_face[ey:ey+eh,ex:ex+ew],model)
                    if pred == 'closed':
                        color = (0,0,255)
                    cv2.rectangle(right_face,(ex,ey),(ex+ew,ey+eh),color,2)
                for (ex,ey,ew,eh) in left_eye:
                    color = (0,255,0)
                    pred = predict(left_face[ey:ey+eh,ex:ex+ew],model)
                    if pred == 'closed':
                        color = (0,0,255)
                    cv2.rectangle(left_face,(ex,ey),(ex+ew,ey+eh),color,2)
                eyes_detected[name] += eye_status

            #Check whether the person has blinked
            #If yes, we display their name
            if isBlinking(eyes_detected[name],3):
                cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
                # Display name
                y = y - 15 if y - 15 > 15 else y + 15
                cv2.putText(frame, name, (x, y), cv2.FONT_HERSHEY_SIMPLEX,0.75, (0, 255, 0), 2)

                #Get the email that appears the most and add it to the global variable
                #Specify that is should respond to the api
                global email
                
                if not emails:
                    email = "UNKOWN"
                else:
                    email = max(set(emails), key = emails.count)
 
                global pleaseStopTheScanning
                pleaseStopTheScanning = True

            else:
                cv2.putText(frame, "Lizard", (x, y), cv2.FONT_HERSHEY_SIMPLEX,0.75, (0, 255, 0), 2)

        return frame

##
#Function to get an updated list of people's emails that are part of a booking in the current day
#
#@return: A list of emails expected during current day
def updateExpectedUsers():
    endpointURL = "http://localhost:3000/getUsersFromDaysEvents"
    responseTemp =requests.get(url = endpointURL)
    if(responseTemp.json() is None):  
        response = {"test@test.com","Test@TEST.com"}
    else:
        response = requests.get(url = endpointURL).json()
    return response

##
#Main function; Continuosly processes stream and recognises people
#Press 'q' button to stop
if __name__ == "__main__":
    try:       
        #Initialize
        (model, face_detector, open_eyes_detector,left_eye_detector,right_eye_detector, video_capture) = init()     
        data = encodingsOfImages()
        email ="UNKOWN"
        pleaseStopTheScanning = False
        isAllowed = False
        allowedResponse = "NO"

        eyes_detected = defaultdict(str)

        oldRefreshTime = 0
        lastSendTime = 0
        emailList = updateExpectedUsers()
        while True:
            #Clear the history after 30 frames - Go back to non-human mode and wait for blink
            for x in eyes_detected:
                if len(eyes_detected[x]) > 30:
                    eyes_detected = defaultdict(str)

            #Run our facial detection
            frame = detect_and_display(model, video_capture, face_detector, open_eyes_detector,left_eye_detector,right_eye_detector, data, eyes_detected)
            
            #Show a nice video feed of what is happening
            cv2.imshow("Face Liveness Detector", frame)

            if (time.time() - oldRefreshTime > 1800):
                print("***************REFRESHED***************")
                oldRefreshTime = time.time()
                emailList = updateExpectedUsers()

            if pleaseStopTheScanning == True and (time.time() - lastSendTime > 1): #and counter <= 60:
                try:
                    #we now need to compare and see if the email that appears the most is in this json object
                    for emailItem in emailList:
                        if email == emailItem:                         
                            validate(email,"Room 9")
                            lastSendTime = time.time()
                            print(str(emailItem))
            
                    pleaseStopTheScanning = False 
                    isAllowed = False  

                except json.decoder.JSONDecodeError:
                    print("Non json object returned")
                
            #Quit on 'q' button    
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        
        cv2.destroyAllWindows()
    except Exception as e:
        print("PROBLEM",e)
        


