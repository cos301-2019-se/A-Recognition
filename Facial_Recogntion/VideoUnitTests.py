## 
# Filename: VideoUnitTests.py
# Version: V1.0
# Author: Adrian le Grange
# Project name: A-Recognition (Advance)
# Organization: Singularity
# Funtional description: Unit tests for video streams and cameras

import unittest
import time
from face_rec import getVideoStream
class TestFaceTracking(unittest.TestCase):

    def testCanOpenCamera(self):
        print("[TEST] Can open camera")
        vs = getVideoStream()
        self.assertTrue(not vs is None and vs.stream.isOpened(), msg="Camera could not be opened")
        vs.stop()
        time.sleep(1) #Python is retarded when threads are opened and closed rapidly

    def testCameraUnavailable(self):
        print("[TEST] Invalid or no camera produces an exception")
        self.assertRaises(Exception,getVideoStream(500), msg="Opening invalid stream did not raise an exception")
        time.sleep(1)
    
    def testCanGrabFrame(self):
        print("[TEST] Can grab frame from camera")
        vs = getVideoStream()
        self.assertTrue(not vs.read() is None)
        vs.stop()
        time.sleep(1)

if __name__ == '__main__':
    unittest.main()