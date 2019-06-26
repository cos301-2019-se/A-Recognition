import unittest
from encoding import encodeImageForDB
from encoding import encodingsOfImages
class TestEncoding(unittest.TestCase):

    def testWithSingleImage(self):
        imageNames = ['./tester.jpg']
        self.assertEqual(encodeImageForDB(imageNames,"Test","test","test"),True)

    def testWithMultipleImages(self):
        imageNames=['./tester.jpg','./5.jpg']
        self.assertTrue(encodeImageForDB(imageNames,'test','test','test'),True)

    def testWithNoParameters(self):
        self.assertRaises(TypeError,encodeImageForDB,msg="encodingImage expected 4 parameters")

    def testWithMissingParameters(self):
        imageNames = ['./tester.jpg']
        self.assertRaises(TypeError,encodeImageForDB,imageNames,"Test","test",msg="encodingImage expected 4 parameters")

    def testWithBrokenImage(self):
        imageNames = ['./tester,jpg']
        self.assertRaises(TypeError,encodeImageForDB,imageNames,msg="An error occured while trying to encode the image or saving to the database")

    #Next part
    def testWithNoParametersForEncodingOfImages(self):
        self.assertRaises(TypeError,encodingsOfImages,msg="encodingImage expected 4 parameters")

    def testWithMissingParametersForEncodingOfImages(self):
        imageNames = ['./tester.jpg']
        self.assertRaises(TypeError,encodingsOfImages,imageNames,"Test","test",msg="encodingImage expected 4 parameters")

    def testWithBrokenImageForEncodingOfImages(self):
        imageNames = ['./tester,jpg']
        self.assertRaises(TypeError,encodingsOfImages,imageNames,msg="An error occured while trying to encode the image/s")

if __name__ == '__main__':
    unittest.main()