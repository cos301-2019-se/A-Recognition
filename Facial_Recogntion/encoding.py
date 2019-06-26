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
#@params images,name,surname,title
#
def encodeImageForDB(images,name,surname,title):
    if(images is None or name is None or surname is None or title is None):
        raise TypeError("encodingImage expected 4 parameters")
    encoding=[]
    print("ENCODING the dataset")
    try:
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
            if user:
                return True
    except TypeError:
        return "An error occured while trying to encode the image or saving to the database"

def encodingsOfImages(images,name=None,surname=None,title=None):
    if(images is None ):
        raise TypeError("encodingImage expected 4 parameters")
    
    knownEncoding = []
    knownNames = []
    for doc in docs:
        print(u'{} => {}'.format(doc.id, doc.to_dict().get("image_vector")))
        knownEncoding.append((np.asarray(doc.to_dict().get("image_vector"))))
        knownNames.append(doc.to_dict().get("Name"))
    encoding=[]
    print("ENCODING the dataset for the facial Recognition ")
    try:
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
                tempObj = title+" "+name+" "+ surname
                knownEncoding.append(encoding[0])
                knownNames.append(tempObj)
                return {"encodings":knownEncoding,"name":knownNames}
    except TypeError:
        return "An error occured while trying to encode the image or saving to the database"

# imageNames = ['./tester.jpg',"./5.jpg"]
# encodingsOfImages(imageNames,"Richard Two","McFadden","Mr")
