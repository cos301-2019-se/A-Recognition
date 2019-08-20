let assert = require('assert');

import manager from '../Database_Manager/databaseManager';
var dbManager = new manager();

dbManager.register({ "body" :
    {
    "email" : "register@unit.test",
    "name" : "unit",
    "surname" : "test",
    "title" : "unit",
    "fd" : [ 0.1, 0.2, 0.3],
    "active" : "true"
    }
}).then( (res) => {
    console.debug(res);
})


describe('Users', function() {
    describe('register()', function() {
      it('should be able to register a new user', function() {
  
          let result = dbManager.register({ "body" :
                      {
                          "email" : "register@unit.test",
                          "name" : "unit",
                          "surname" : "test",
                          "title" : "unit",
                          "fd" : [ 0.1, 0.2, 0.3],
                          "active" : "true"
                      }
                  
          }).then( (res) => {
              expect(res).toBe( {
                  "status" : "Success"    
              });
          }); 
      });
      it('should reject registration of a existing user', function() {
          assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
  });