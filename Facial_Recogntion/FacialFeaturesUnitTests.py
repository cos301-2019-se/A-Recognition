## 
# Filename: FacialFeaturesUnitTests.py
# Version: V1.0
# Author: Adrian le Grange
# Project name: A-Recognition (Advance)
# Organization: Singularity
# Funtional description: Unit tests for all facial feature detection

import unittest
import os
import cv2

class TestFaceTracking(unittest.TestCase):
    
    def testFrontalFaceModelAvailable(self):
        print("[TEST] Is Frontal face detection models available")
        self.assertTrue(os.path.exists('lbpcascade_frontalface.xml'), msg="'lbpcascade_frontalface.xml' could not be found")
        self.assertTrue(os.path.exists('haarcascade_frontalface_alt.xml'), msg="'haarcascade_frontalface_alt.xml' could not be found")

    def testEyeglassesModelAvailable(self):
        print("[TEST] Is Eyeglasses models available")
        self.assertTrue(os.path.exists('haarcascade_eye_tree_eyeglasses.xml'), msg="'haarcascade_eye_tree_eyeglasses.xml' could not be found")
    
    def testLeftEyeModelAvailable(self):
        print("[TEST] Is Left detection models available")
        self.assertTrue(os.path.exists('haarcascade_lefteye_2splits.xml'), msg="'haarcascade_lefteye_2splits.xml' could not be found")
    
    def testRightEyeModelAvailable(self):
        print("[TEST] Is Right detection models available")
        self.assertTrue(os.path.exists('haarcascade_righteye_2splits.xml'), msg="'haarcascade_righteye_2splits.xml' could not be found")
    
    def testOpenCloseEyeModelAvailable(self):
        print("[TEST] Is Opened/Closed eye detection model available")
        self.assertTrue(os.path.exists('model.h5'), msg="'model.h5' could not be found")

    def testCanDetectFace(self):
        print("[TEST] Can detect face")
        testFace = cv2.imread('UnitTestResources/grayFace.jpg')
        face_detector = cv2.CascadeClassifier('lbpcascade_frontalface.xml')
        face = face_detector.detectMultiScale(testFace, scaleFactor=1.2, minNeighbors=5, minSize=(50, 50), flags=cv2.CASCADE_SCALE_IMAGE)
        self.assertTrue(len(face) == 1, msg="Could not detect test face")

    def testCanLeftEye(self):
        print("[TEST] Can detect left eye")
        left_face_gray = cv2.imread('UnitTestResources/grayFaceLeft.jpg')
        left_eye_detector = cv2.CascadeClassifier('haarcascade_lefteye_2splits.xml')
        left_eye = left_eye_detector.detectMultiScale(left_face_gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30), flags = cv2.CASCADE_SCALE_IMAGE)
        self.assertTrue(not left_eye is None, msg="Could not detect left eye")

    def testCanRightEye(self):
        print("[TEST] Can detect right eye")
        right_face_gray = cv2.imread('UnitTestResources/grayFaceRight.jpg')
        right_eye_detector = cv2.CascadeClassifier('haarcascade_righteye_2splits.xml')
        right_eye = right_eye_detector.detectMultiScale(right_face_gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30), flags = cv2.CASCADE_SCALE_IMAGE)
        self.assertTrue(not right_eye is None, msg="Could not detect right eye")

    

if __name__ == '__main__':
    unittest.main()