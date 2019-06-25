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

def encodeImage(images,name,surname,title):
    encoding=[]
    print("ENCODING the dataset")

    for image_path in (images):
        # Load image
        image = cv2.imread(image_path)
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
            u'Name': name,
            u'Surname': surname,
            u'Title': title,
            u'image_vector':arr
        }
    # Add the new user to the database
    users_ref.document(name).set(user)
    return
imageNames = ['./tester.jpg','./5.jpg']
encodeImage(imageNames,"Richard Two","McFadden","Mr")
