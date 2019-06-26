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

db = firestore.client()

#GET the collection Users for Facial Recognition
users_ref = db.collection(u'Users')

#docs now contain the data in Users
docs = users_ref.stream()

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

    #TODO This should load from our database, not classify a collection of images
    print("[LOG] Collecting images ...")
    images = []
    for direc, _, files in tqdm(os.walk(dataset)):
        for file in files:
            if file.endswith("jpg"):
                images.append(os.path.join(direc,file))
                print("Found image" + file)
    return (model,face_detector, open_eyes_detector, left_eye_detector,right_eye_detector, video_capture, images) 

def isBlinking(history, maxFrames):
    """ @history: A string containing the history of eyes status 
         where a '1' means that the eyes were closed and '0' open.
        @maxFrames: The maximal number of successive frames where an eye is closed """
    for i in range(maxFrames):
        pattern = '1' + '0'*(i+1) + '1'
        if pattern in history:
            return True
    return False

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
    #    matches = []
        #For each detected face
        for (x,y,w,h) in faces:
            #Encode the face into a 128-d embeddings vector
            encoding = face_recognition.face_encodings(rgb, [(y, x+w, y+h, x)])[0]
            #For now we don't know the person name
            name = "Unknown"

            #Compare the vector with all known faces encodings
            for e in data['encodings']:
                for s in e:
                    #print("Hello "+str(s['encoding']))
                    temp = s['encoding']
                    matches = face_recognition.compare_faces([temp], encoding)
                    if True in matches:
                        # print("Please help")
                        # name = users_ref.stream()

                        # for s in name:
                        #     print(u'{} => {}'.format(s.id, s.to_dict().get("Name")))
                    

            #Check if this face mathces a known person
            # if True in matches:
            #     print("WE ARE HERE")
            #     matchedIdxs = [i for (i, b) in enumerate(matches) if b]
            #     counts = {}
            #     for i in matchedIdxs:
            #         name = data["name"][i]
                    
            #         counts[name] = counts.get(name, 0) + 1
            # #Determine the recognized face with the largest number of votes
            # name = max(counts, key=counts.get)
            #########################################
            ########################################
            #cities_ref.where(u'state', u'==', u'CA')
            #########################################
            ########################################

            #Store the cropped face
            face = frame[y:y+h,x:x+w]
            gray_face = gray[y:y+h,x:x+w]

            eyes = []
            
            #We now detect the eyes of the face
            #Check if the eyes are open (Considering glasses)
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
                        eye_status='1'
                        color = (0,0,255)
                    cv2.rectangle(right_face,(ex,ey),(ex+ew,ey+eh),color,2)
                for (ex,ey,ew,eh) in left_eye:
                    color = (0,255,0)
                    pred = predict(left_face[ey:ey+eh,ex:ex+ew],model)
                    if pred == 'closed':
                        eye_status='1'
                        color = (0,0,255)
                    cv2.rectangle(left_face,(ex,ey),(ex+ew,ey+eh),color,2)
                eyes_detected[name] += eye_status

            #Each time, we check if the person has blinked
            #If yes, we display its name
            if isBlinking(eyes_detected[name],3):
                cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
                # Display name
                y = y - 15 if y - 15 > 15 else y + 15
                cv2.putText(frame, name, (x, y), cv2.FONT_HERSHEY_SIMPLEX,0.75, (0, 255, 0), 2)
            else:
                cv2.putText(frame, "Lizard", (x, y), cv2.FONT_HERSHEY_SIMPLEX,0.75, (0, 255, 0), 2)

        return frame


if __name__ == "__main__":
    #Initialize
    (model, face_detector, open_eyes_detector,left_eye_detector,right_eye_detector, video_capture, images) = init()
    
    
    data = encodingsOfImages(images)

    eyes_detected = defaultdict(str)
    while True:
        #Clear the history after 30 frames - Go back to non-human mode and wait for blink
        if len(eyes_detected["Unknown"]) > 30:
            eyes_detected.clear()
        
        #Run our facial detection
        frame = detect_and_display(model, video_capture, face_detector, open_eyes_detector,left_eye_detector,right_eye_detector, data, eyes_detected)
        
        #Show a nice video feed of what is happening
        cv2.imshow("Face Liveness Detector", frame)

        #Quit on 'q' button    
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cv2.destroyAllWindows()
    video_capture.stop()