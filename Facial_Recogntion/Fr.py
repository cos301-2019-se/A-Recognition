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
    #TODO Adrian figure out the videocapture, so changing below
    frame = video_capture.read()
    # resize the frame
    frame = cv2.resize(frame, (0, 0), fx=0.6, fy=0.6)
    #####################################################

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

        #Assign unknown as we do not know the person's name at the moment
        name = "Unknown"

        # If there is atleast one match we can continue
        if True in matches:
            matchedIdxs = [i for (i, b) in enumerate(matches) if b]
            counts = {}
            for i in matchedIdxs:
                name = data["names"][i]
                counts[name] = counts.get(name, 0) + 1

            # The known encoding with the most number of matches corresponds to the detected face name
            name = max(counts, key=counts.get)

        face = frame[y:y+h,x:x+w]
        gray_face = gray[y:y+h,x:x+w]

        eyes = []

        #Detecting the eyes
        # check first if eyes are open
        open_eyes_glasses = open_eyes_detector.detectMultiScale(
            gray_face,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30),
            flags = cv2.CASCADE_SCALE_IMAGE
        )
        # if open_eyes_glasses detected then the user's eyes were open
        if len(open_eyes_glasses) == 2:
            eyes_detected[name]+='1'
            for (ex,ey,ew,eh) in open_eyes_glasses:
                cv2.rectangle(face,(ex,ey),(ex+ew,ey+eh),(0,255,0),2)
        
        # otherwise try detecting eyes using left and right_eye_detector             
        else:
            # separate the face into left and right sides
            left_face = frame[y:y+h, x+int(w/2):x+w]
            left_face_gray = gray[y:y+h, x+int(w/2):x+w]

            right_face = frame[y:y+h, x:x+int(w/2)]
            right_face_gray = gray[y:y+h, x:x+int(w/2)]

            # Detect the left eye
            left_eye = left_eye_detector.detectMultiScale(
                left_face_gray,
                scaleFactor=1.1,
                minNeighbors=5,
                minSize=(30, 30),
                flags = cv2.CASCADE_SCALE_IMAGE
            )
            # Detect the right eye
            right_eye = right_eye_detector.detectMultiScale(
                right_face_gray,
                scaleFactor=1.1,
                minNeighbors=5,
                minSize=(30, 30),
                flags = cv2.CASCADE_SCALE_IMAGE
            )

            #Assume the user's eyes are open at the start
            eye_status = '1' 

            # For each eye check wether the eye is closed.
            # If one is closed we conclude the eyes are closed
            #So an or 
            for (ex,ey,ew,eh) in right_eye:
                color = (0,255,0)
                pred = predict(right_face[ey:ey+eh,ex:ex+ew],model)

                if pred == 'closed':
                    eye_status='0'
                    color = (0,0,255)
                cv2.rectangle(right_face,(ex,ey),(ex+ew,ey+eh),color,2)

            for (ex,ey,ew,eh) in left_eye:
                color = (0,255,0)
                pred = predict(left_face[ey:ey+eh,ex:ex+ew],model)

                if pred == 'closed':
                    eye_status='0'
                    color = (0,0,255)

                cv2.rectangle(left_face,(ex,ey),(ex+ew,ey+eh),color,2)
            eyes_detected[name] += eye_status
    # Check if the user has blinked
    # If yes, we display their name
    if isBlinking(eyes_detected[name],3):
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
        # Display name
        print("WELCOME "+data["name"])
        y = y - 15 if y - 15 > 15 else y + 15
        cv2.putText(frame, name, (x, y), cv2.FONT_HERSHEY_SIMPLEX,0.75, (0, 255, 0), 2)

    return frame