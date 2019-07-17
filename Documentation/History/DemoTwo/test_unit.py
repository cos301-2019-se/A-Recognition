import unittest
from fr import fillArrays
from fr import test
from fr import registerTest

class TestUnit(unittest.TestCase):
 
    def setUp(self):
        pass
 
    def test_image_Correct(self):
        self.assertEqual( test("tester.jpg"), {"success":"True","Title":"Mr","Surname":"McFadden" })
    def test_image_false(self):
        self.assertEqual( test('12.jpg'), {"success":"False"} )
    def test_array_filling(self):
        self.assertEqual( fillArrays(), True )
    def test_registering_user_true(self):
        self.assertEqual( registerTest("Richard","McFadden","Mr","tester.jpg"), {
            u'Name': "Richard",
            u'Surname': "McFadden",
            u'Title': "Mr"
        } )

if __name__ == '__main__':
    unittest.main()