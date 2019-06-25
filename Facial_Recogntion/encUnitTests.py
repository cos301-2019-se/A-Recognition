import unittest
from encoding import encodeImage

class TestEncoding(unittest.TestCase):

    def testWithSingleImage(self):
        imageNames = ['./tester.jpg']
        self.assertEqual(encodeImage(imageNames,"Test","test","test"),True)

    def testWithMultipleImages(self):
        imageNames=['./tester.jpg','./5.jpg']
        self.assertTrue(encodeImage(imageNames,'test','test','test'),True)

    def testWithNoParameters(self):
        self.assertRaises(TypeError,encodeImage,msg="encodingImage expected 4 parameters")

    def testWithMissingParameters(self):
        imageNames = ['./tester.jpg']
        self.assertRaises(TypeError,encodeImage,imageNames,"Test","test",msg="encodingImage expected 4 parameters")

    def testWithBrokenImage(self):
        imageNames = ['./tester,jpg']
        self.assertRaises(TypeError,encodeImage,imageNames,msg="An error occured while trying to encode the image or saving to the database")

if __name__ == '__main__':
    unittest.main()