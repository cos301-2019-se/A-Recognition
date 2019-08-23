let assert = require('assert');

var DbManager = require("../Database_Manager/databaseManager");
var dbManager = new DbManager();

describe('Users', function() {
    describe('retrieveEncodings()', function() {
        //Configure timeout for async tests
        beforeEach(function(done) {
            setTimeout(function() {
                value = 0;
                done();
            }, 5000);
        });

        it('should return two arrays as a JSON object', function(done) {
            dbManager.retrieveEncodings().then( (res, reject) => {
                expect(res.emails).not.toEqual(undefined);
                expect(res.fd).not.toEqual(undefined);
                
                expect(Array.isArray(res.emails)).toBe(true);
                expect(Array.isArray(res.fd)).toBe(true);
                done();
            })
        });
        
    });//retrieveEncodings()
    
    describe('register()', function() {
        //Configure timeout for async tests
        beforeEach(function(done) {
            setTimeout(function() {
                value = 0;
                done();
            }, 5000);
        });
        
        it('should be able to register a new user', function(done) {
            dbManager.register({ "body" :
                {
                    "email" : "register@unit.test",
                    "name" : "unit",
                    "surname" : "test",
                    "title" : "unit",
                    "fd" : [ 0.1, 0.2, 0.3],
                    "active" : "true"
                }
            }).then( (res, reject) => {
                expect(res).toEqual( {
                    "status" : "Success"
                });
                done();
            })
        });

        it('should reject registration of a existing user', function(done) {
            dbManager.register({ "body" :
                {
                    "email" : "register@unit.test",
                    "name" : "unit",
                    "surname" : "test",
                    "title" : "unit",
                    "fd" : [ 0.1, 0.2, 0.3],
                    "active" : "true"
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : "Specified user already exists"
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'body\' field', function(done) {
            dbManager.register(
                {
                    "email" : "unit@test.test",
                    "name" : "unit",
                    "surname" : "test",
                    "title" : "unit",
                    "fd" : [ 0.1, 0.2, 0.3],
                    "active" : "true"
                }
            ).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'body\' field was not specified!'
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'email\' field', function(done) {
            dbManager.register({ "body" :
                {
                    "name" : "unit",
                    "surname" : "test",
                    "title" : "unit",
                    "fd" : [ 0.1, 0.2, 0.3],
                    "active" : "true"
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'email\' field was not specified!'
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'name\' field', function(done) {
            dbManager.register({ "body" :
                {
                    "email" : "unit@test.test",
                    "surname" : "test",
                    "title" : "unit",
                    "fd" : [ 0.1, 0.2, 0.3],
                    "active" : "true"
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'name\' field was not specified!'
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'surname\' field', function(done) {
            dbManager.register({ "body" :
                {
                    "email" : "unit@test.test",
                    "name" : "unit",
                    "title" : "unit",
                    "fd" : [ 0.1, 0.2, 0.3],
                    "active" : "true"
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'surname\' field was not specified!'
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'title\' field', function(done) {
            dbManager.register({ "body" :
                {
                    "email" : "unit@test.test",
                    "name" : "unit",
                    "surname" : "test",
                    "fd" : [ 0.1, 0.2, 0.3],
                    "active" : "true"
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'title\' field was not specified!'
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'fd\' field', function(done) {
            dbManager.register({ "body" :
                {
                    "email" : "unit@test.test",
                    "name" : "unit",
                    "surname" : "test",
                    "title" : "unit",
                    "active" : "true"
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'fd\' field was not specified!'
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'active\' field', function(done) {
            dbManager.register({ "body" :
                {
                    "email" : "unit@test.test",
                    "name" : "unit",
                    "surname" : "test",
                    "title" : "unit",
                    "fd" : [ 0.1, 0.2, 0.3]
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'active\' field was not specified!'
                });
                done();
            })
        });
    });//register()

    describe('retrieveUser()', function() {
        //Configure timeout for async tests
        beforeEach(function(done) {
            setTimeout(function() {
                value = 0;
                done();
            }, 5000);
        });
        
        it('should be able to retrieve a user', function(done) {
            dbManager.retrieveUser({ "body" :
                {
                    "email" : "register@unit.test"
                }
            }).then( (res, reject) => {
                expect(res).toEqual( {
                    "status" : "Success",
                    "email" : "register@unit.test",
                    "name" : "unit",
                    "surname" : "test",
                    "title" : "unit",
                    "fd" : [ 0.1, 0.2, 0.3]
                });
                done();
            })
        });

        it('should return a error if a user does not exist', function(done) {
            dbManager.retrieveUser({ "body" :
                {
                    "email" : "doesnotexist@unit.test"
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : "Specified user does not exist!"
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'body\' field', function(done) {
            dbManager.retrieveUser(
                {
                    "email" : "doesnotexist@unit.test"
                }
            ).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'body\' field was not specified!'
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'email\' field', function(done) {
            dbManager.retrieveUser({ "body" :
                {
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'email\' field was not specified!'
                });
                done();
            })
        });
});//retrieveUser()

    describe('update()', function() {
        //Configure timeout for async tests
        beforeEach(function(done) {
            setTimeout(function() {
                value = 0;
                done();
            }, 5000);
        });
        
        it('should be able to update a user', function(done) {
            dbManager.update({ "body" :
                { 
                    "email" : "register@unit.test",
                    "name" : "UPDATEDunit",
                    "surname": "UPDATEDtest",
                    "title": "UPDATEDunit",
                    "fd": [123,321,132],
                    "active" : true
                }
            }).then( (res, reject) => {
                expect(res).toEqual( {
                    "status" : "Success"
                });
                done();
            })
        });

        it('should return a error if a user does not exist', function(done) {
            dbManager.update({ "body" :
                    { 
                        "email" : "doesnotexist@some.domain",
                        "name" : "aName",
                        "surname": "aSurname",
                        "title": "aTitle",
                        "fd": [123, 456, 789],
                        "active" : true
                    }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : "Specified user does not exist!"
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'body\' field', function(done) {
            dbManager.update(
                {
                    "email" : "unit@test.test",
                    "name" : "unit",
                    "surname" : "test",
                    "title" : "unit",
                    "fd" : [ 0.1, 0.2, 0.3],
                    "active" : "true"
                }
            ).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'body\' field was not specified!'
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'email\' field', function(done) {
            dbManager.update({ "body" :
                {
                    "name" : "unit",
                    "surname" : "test",
                    "title" : "unit",
                    "fd" : [ 0.1, 0.2, 0.3],
                    "active" : "true"
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'email\' field was not specified!'
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'name\' field', function(done) {
            dbManager.update({ "body" :
                {
                    "email" : "unit@test.test",
                    "surname" : "test",
                    "title" : "unit",
                    "fd" : [ 0.1, 0.2, 0.3],
                    "active" : "true"
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'name\' field was not specified!'
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'surname\' field', function(done) {
            dbManager.update({ "body" :
                {
                    "email" : "unit@test.test",
                    "name" : "unit",
                    "title" : "unit",
                    "fd" : [ 0.1, 0.2, 0.3],
                    "active" : "true"
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'surname\' field was not specified!'
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'title\' field', function(done) {
            dbManager.update({ "body" :
                {
                    "email" : "unit@test.test",
                    "name" : "unit",
                    "surname" : "test",
                    "fd" : [ 0.1, 0.2, 0.3],
                    "active" : "true"
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'title\' field was not specified!'
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'fd\' field', function(done) {
            dbManager.update({ "body" :
                {
                    "email" : "unit@test.test",
                    "name" : "unit",
                    "surname" : "test",
                    "title" : "unit",
                    "active" : "true"
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'fd\' field was not specified!'
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'active\' field', function(done) {
            dbManager.update({ "body" :
                {
                    "email" : "unit@test.test",
                    "name" : "unit",
                    "surname" : "test",
                    "title" : "unit",
                    "fd" : [ 0.1, 0.2, 0.3]
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'active\' field was not specified!'
                });
                done();
            })
        });
    });//update()

    describe('deleteUser()', function() {
        //Configure timeout for async tests
        beforeEach(function(done) {
            setTimeout(function() {
                value = 0;
                done();
            }, 5000);
        });
        
        it('should be able to delete a user', function(done) {
            dbManager.deleteUser({ "body" :
                { 
                    "email" : "register@unit.test"
                }
            }).then( (res, reject) => {
                expect(res).toEqual( {
                    "status" : "Success"
                });
                done();
            })
        });

        it('should return a error if a user does not exist', function(done) {
            dbManager.deleteUser({ "body" :
                    { 
                        "email" : "doesnotexist@some.domain"
                    }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : "Specified user does not exist!"
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'body\' field', function(done) {
            dbManager.deleteUser(
                {
                    "email" : "unit@test.test"
                }
            ).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'body\' field was not specified!'
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'email\' field', function(done) {
            dbManager.update({ "body" :
                {
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'email\' field was not specified!'
                });
                done();
            })
        });
    });//deleteUser()

});//users

describe('Events', function() {
    describe('addEvent()', function() {
        //Configure timeout for async tests
        beforeEach(function(done) {
            setTimeout(function() {
                value = 0;
                done();
            }, 5000);
        });
        
        it('should be able to add a new event', function(done) {
            dbManager.addEvent({ "body" :
                {
                    "eventId" : "unitTestingEvent",
                    "summary" : "unit",
                    "location" : "test",
                    "startTime" : "01/01/2000 00:00",
                    "endTime" : "02/01/2000 00:00",
                    "attendeeOTPpairs" : [
                        {
                            "email" : "email@some.domain",
                            "otp" : "123456"
                        },
                        {
                            "email" : "other@some.domain",
                            "otp" : "654321"
                        }
                    ],
                    "eventOTP"  : ""
                }
            }).then( (res, reject) => {
                expect(res).toEqual( {
                    "status" : "Success"
                });
                done();
            })
        });

        it('should reject if a already existing event is added', function(done) {
            dbManager.addEvent({ "body" :
                {
                    "eventId" : "unitTestingEvent",
                    "summary" : "unit",
                    "location" : "test",
                    "startTime" : "01/01/2000 00:00",
                    "endTime" : "02/01/2000 00:00",
                    "attendeeOTPpairs" : [
                        {
                            "email" : "email@some.domain",
                            "otp" : "123456"
                        },
                        {
                            "email" : "other@some.domain",
                            "otp" : "654321"
                        }
                    ],
                    "eventOTP"  : ""
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : "Specified event already exists!"
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'body\' field', function(done) {
            dbManager.addEvent(
                {
                    "eventId" : "unitTestingEvent",
                    "summary" : "unit",
                    "location" : "test",
                    "startTime" : "01/01/2000 00:00",
                    "endTime" : "02/01/2000 00:00",
                    "attendeeOTPpairs" : [
                        {
                            "email" : "email@some.domain",
                            "otp" : "123456"
                        },
                        {
                            "email" : "other@some.domain",
                            "otp" : "654321"
                        }
                    ],
                    "eventOTP"  : ""
                }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'body\' field was not specified!'
                });
                done();
            })
        });
        
        it('should return error when recieving a request with a missing \'eventId\' field', function(done) {
            dbManager.addEvent({ "body" :
                {
                    "summary" : "unit",
                    "location" : "test",
                    "startTime" : "01/01/2000 00:00",
                    "endTime" : "02/01/2000 00:00",
                    "attendeeOTPpairs" : [
                        {
                            "email" : "email@some.domain",
                            "otp" : "123456"
                        },
                        {
                            "email" : "other@some.domain",
                            "otp" : "654321"
                        }
                    ],
                    "eventOTP"  : ""
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'eventId\' field was not specified!'
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'summary\' field', function(done) {
            dbManager.addEvent({ "body" :
                {
                    "eventId" : "unitTestingEvent",
                    "location" : "test",
                    "startTime" : "01/01/2000 00:00",
                    "endTime" : "02/01/2000 00:00",
                    "attendeeOTPpairs" : [
                        {
                            "email" : "email@some.domain",
                            "otp" : "123456"
                        },
                        {
                            "email" : "other@some.domain",
                            "otp" : "654321"
                        }
                    ],
                    "eventOTP"  : ""
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'summary\' field was not specified!'
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'location\' field', function(done) {
            dbManager.addEvent({ "body" :
                {
                    "eventId" : "unitTestingEvent",
                    "summary" : "unit",
                    "startTime" : "01/01/2000 00:00",
                    "endTime" : "02/01/2000 00:00",
                    "attendeeOTPpairs" : [
                        {
                            "email" : "email@some.domain",
                            "otp" : "123456"
                        },
                        {
                            "email" : "other@some.domain",
                            "otp" : "654321"
                        }
                    ],
                    "eventOTP"  : ""
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'location\' field was not specified!'
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'startTime\' field', function(done) {
            dbManager.addEvent({ "body" :
                {
                    "eventId" : "unitTestingEvent",
                    "summary" : "unit",
                    "location" : "test",
                    "endTime" : "02/01/2000 00:00",
                    "attendeeOTPpairs" : [
                        {
                            "email" : "email@some.domain",
                            "otp" : "123456"
                        },
                        {
                            "email" : "other@some.domain",
                            "otp" : "654321"
                        }
                    ],
                    "eventOTP"  : ""
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'startTime\' field was not specified!'
                });
                done();
            })
        });
        
        it('should return error when recieving a request with a missing \'endTime\' field', function(done) {
            dbManager.addEvent({ "body" :
                {
                    "eventId" : "unitTestingEvent",
                    "summary" : "unit",
                    "location" : "test",
                    "startTime" : "01/01/2000 00:00",
                    "attendeeOTPpairs" : [
                        {
                            "email" : "email@some.domain",
                            "otp" : "123456"
                        },
                        {
                            "email" : "other@some.domain",
                            "otp" : "654321"
                        }
                    ],
                    "eventOTP"  : ""
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'endTime\' field was not specified!'
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'attendeeOTPpairs\' field', function(done) {
            dbManager.addEvent({ "body" :
                {
                    "eventId" : "unitTestingEvent",
                    "summary" : "unit",
                    "location" : "test",
                    "startTime" : "01/01/2000 00:00",
                    "endTime" : "02/01/2000 00:00",
                    "eventOTP"  : ""
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'attendeeOTPpairs\' field was not specified!'
                });
                done();
            })
        });

    });//addEvent()

    describe('retrieveEvent()', function() {
        //Configure timeout for async tests
        beforeEach(function(done) {
            setTimeout(function() {
                value = 0;
                done();
            }, 5000);
        });
        
        it('should be able to retrieve an existing event', function(done) {
            dbManager.retrieveEvent({ "body" :
                {
                    "eventId" : "unitTestingEvent"
                }
            }).then( (res, reject) => {
                expect(res).toEqual( {
                    "status" : "Success",
                    "eventId" : "unitTestingEvent",
                    "summary" : "unit",
                    "location" : "test",
                    "startTime" : "01/01/2000 00:00",
                    "endTime" : "02/01/2000 00:00",
                    "attendeeOTPpairs" : [
                        {
                            "email" : "email@some.domain",
                            "otp" : "123456"
                        },
                        {
                            "email" : "other@some.domain",
                            "otp" : "654321"
                        }
                    ],
                    "eventOTP"  : ""
                });
                done();
            })
        });

        it('should reject if the request event does not exist', function(done) {
            dbManager.retrieveEvent({ "body" :
                {
                    "eventId" : "thiseventdoesnotexist"
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : "Specified event does not exist!"
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'body\' field', function(done) {
            dbManager.retrieveEvent(
                    {
                        "eventId" : "unitTestingEvent"
                    }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'body\' field was not specified!'
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'eventId\' field', function(done) {
            dbManager.retrieveEvent({ "body" :
                    {
                    }
                }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'eventId\' field was not specified!'
                });
                done();
            })
        });

    });//retrieveEvent()

    describe('retrieveEventIds()', function() {
        //Configure timeout for async tests
        beforeEach(function(done) {
            setTimeout(function() {
                value = 0;
                done();
            }, 5000);
        });
        
        it('should respond with an array in a JSON object', function(done) {
            dbManager.retrieveEventIds().then( (res, reject) => {
                expect(res['eventIds']).not.toBe(undefined);
                expect(Array.isArray(res.eventIds)).toBe(true);
                done();
            })
        });
    });//retrieveEventIds()
    
    describe('updateEvent()', function() {
        //Configure timeout for async tests
        beforeEach(function(done) {
            setTimeout(function() {
                value = 0;
                done();
            }, 5000);
        });
        
        it('should be able to update an existing event', function(done) {
            dbManager.updateEvent({ "body" :
                {
                    "eventId" : "unitTestingEvent",
                    "summary" : "UPDATEunit",
                    "location" : "UPDATEtest",
                    "startTime" : "01/01/2000 22:22",
                    "endTime" : "02/01/2000 22:22",
                    "attendeeOTPpairs" : [
                        {
                            "email" : "UPDATEemail@some.domain",
                            "otp" : "123456"
                        },
                        {
                            "email" : "UPDATEother@some.domain",
                            "otp" : "654321"
                        }
                    ],
                    "eventOTP"  : ""
                }
                }).then( (res) => {
                expect(res).toEqual({
                    "status" : "Success"
                });
                done();
            });
        });

        it('should return an error if update is done on a event that does not exist', function(done) {
            dbManager.updateEvent({ "body" :
                    {
                        "eventId" : "eventthatdoesnotexist",
                        "location" : "UPDATEDunit",
                        "startTime" : "02/02/2002 00:00",
                        "endTime" : "02/02/2002 01:00",
                        "attendeeOTPpairs" : [
                            {
                                "email" : "unit@test.test",
                                "otp" : "99999"
                            },
                            {
                                "email" : "fake@for.test",
                                "otp" : "88888"
                            },
                            {
                                "email" : "added@for.update",
                                "otp" : "77777"
                            }
                        ],
                        "summary" : "UPDATED Unit testing"
                    }
                }).catch( (reject) => {
                expect(reject).toEqual({
                    "status" : "Failure",
                    "message" : "Specified event does not exist!"
                });
                done();
            });
        });

        it('should return error when recieving a request with a missing \'body\' field', function(done) {
            dbManager.updateEvent(
                {
                    "eventId" : "unitTestingEvent",
                    "summary" : "unit",
                    "location" : "test",
                    "startTime" : "01/01/2000 00:00",
                    "endTime" : "02/01/2000 00:00",
                    "attendeeOTPpairs" : [
                        {
                            "email" : "email@some.domain",
                            "otp" : "123456"
                        },
                        {
                            "email" : "other@some.domain",
                            "otp" : "654321"
                        }
                    ],
                    "eventOTP"  : ""
                }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'body\' field was not specified!'
                });
                done();
            })
        });
        
        it('should return error when recieving a request with a missing \'eventId\' field', function(done) {
            dbManager.updateEvent({ "body" :
                {
                    "summary" : "unit",
                    "location" : "test",
                    "startTime" : "01/01/2000 00:00",
                    "endTime" : "02/01/2000 00:00",
                    "attendeeOTPpairs" : [
                        {
                            "email" : "email@some.domain",
                            "otp" : "123456"
                        },
                        {
                            "email" : "other@some.domain",
                            "otp" : "654321"
                        }
                    ],
                    "eventOTP"  : ""
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'eventId\' field was not specified!'
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'summary\' field', function(done) {
            dbManager.updateEvent({ "body" :
                {
                    "eventId" : "unitTestingEvent",
                    "location" : "test",
                    "startTime" : "01/01/2000 00:00",
                    "endTime" : "02/01/2000 00:00",
                    "attendeeOTPpairs" : [
                        {
                            "email" : "email@some.domain",
                            "otp" : "123456"
                        },
                        {
                            "email" : "other@some.domain",
                            "otp" : "654321"
                        }
                    ],
                    "eventOTP"  : ""
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'summary\' field was not specified!'
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'location\' field', function(done) {
            dbManager.updateEvent({ "body" :
                {
                    "eventId" : "unitTestingEvent",
                    "summary" : "unit",
                    "startTime" : "01/01/2000 00:00",
                    "endTime" : "02/01/2000 00:00",
                    "attendeeOTPpairs" : [
                        {
                            "email" : "email@some.domain",
                            "otp" : "123456"
                        },
                        {
                            "email" : "other@some.domain",
                            "otp" : "654321"
                        }
                    ],
                    "eventOTP"  : ""
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'location\' field was not specified!'
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'startTime\' field', function(done) {
            dbManager.updateEvent({ "body" :
                {
                    "eventId" : "unitTestingEvent",
                    "summary" : "unit",
                    "location" : "test",
                    "endTime" : "02/01/2000 00:00",
                    "attendeeOTPpairs" : [
                        {
                            "email" : "email@some.domain",
                            "otp" : "123456"
                        },
                        {
                            "email" : "other@some.domain",
                            "otp" : "654321"
                        }
                    ],
                    "eventOTP"  : ""
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'startTime\' field was not specified!'
                });
                done();
            })
        });
        
        it('should return error when recieving a request with a missing \'endTime\' field', function(done) {
            dbManager.updateEvent({ "body" :
                {
                    "eventId" : "unitTestingEvent",
                    "summary" : "unit",
                    "location" : "test",
                    "startTime" : "01/01/2000 00:00",
                    "attendeeOTPpairs" : [
                        {
                            "email" : "email@some.domain",
                            "otp" : "123456"
                        },
                        {
                            "email" : "other@some.domain",
                            "otp" : "654321"
                        }
                    ],
                    "eventOTP"  : ""
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'endTime\' field was not specified!'
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'attendeeOTPpairs\' field', function(done) {
            dbManager.updateEvent({ "body" :
                {
                    "eventId" : "unitTestingEvent",
                    "summary" : "unit",
                    "location" : "test",
                    "startTime" : "01/01/2000 00:00",
                    "endTime" : "02/01/2000 00:00",
                    "eventOTP"  : ""
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'attendeeOTPpairs\' field was not specified!'
                });
                done();
            })
        });
    });//updateEvent()

    describe('addAttendee()', function() {
        //Configure timeout for async tests
        beforeEach(function(done) {
            setTimeout(function() {
                value = 0;
                done();
            }, 5000);
        });
        
        it('should be able to add a new attendee to an existing event', function(done) {
            dbManager.addAttendee({ "body" :
                {
                    "eventId" : "unitTestingEvent",
                    "email" : "add@attendee.event",
                    "otp" : "101010"
                }
                }).then( (res) => {
                expect(res).toEqual({
                    "status" : "Success"
                });
                done();
            });
        });

        it('should return an error if the attendee already exists', function(done) {
            dbManager.addAttendee({ "body" :
                    {
                        "eventId" : "unitTestingEvent",
                        "email" : "add@attendee.event",
                        "otp" : "101010"
                    }
                }).catch( (reject) => {
                expect(reject).toEqual({
                    "status" : "Failure",
                    "message" : "Provided email is already registered in event!"
                });
                done();
            });
        });

        it('should return an error if the specified event does not exist', function(done) {
            dbManager.addAttendee({ "body" :
                    {
                        "eventId" : "eventthatdoesnotexist",
                        "email" : "add@attendee.event",
                        "otp" : "101010"
                    }
                }).catch( (reject) => {
                expect(reject).toEqual({
                    "status" : "Failure",
                    "message" : "Specified event does not exist!"
                });
                done();
            });
        });

        it('should return error when recieving a request with a missing \'body\' field', function(done) {
            dbManager.addAttendee(
                {
                    "email" : "doesnotexist@unit.test"
                }
            ).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'body\' field was not specified!'
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'email\' field', function(done) {
            dbManager.retrieveUser({ "body" :
                {
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'email\' field was not specified!'
                });
                done();
            })
        });
    });//updateEvent()

    describe('getEventAttendees()', function() {
        //Configure timeout for async tests
        beforeEach(function(done) {
            setTimeout(function() {
                value = 0;
                done();
            }, 5000);
        });
        
        it('should respond with a JSON object containing an array of attendee objects', function(done) {
            dbManager.getEventAttendees({ "body" : {
                "eventId" : "unitTestingEvent"
            }
            }).then( (res) => {
                expect(res['attendeeOTPpairs']).not.toBe(undefined);
                expect(Array.isArray(res.attendeeOTPpairs)).toBe(true);
                expect(res.attendeeOTPpairs[0]['email']).not.toBe(undefined);
                expect(res.attendeeOTPpairs[0]['otp']).not.toBe(undefined);
                done();
            })
        });

        it('should return error when recieving a request with a missing \'body\' field', function(done) {
            dbManager.getEventAttendees(
                {
                    "eventId" : "unitTestingEvent"
                }
            ).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'body\' field was not specified!'
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'eventId\' field', function(done) {
            dbManager.getEventAttendees({ "body" :
                {
                }
            }).catch( (reject) => {
                expect(reject).toEqual(
                    {
                        "status" : "Failure",
                        "message" : '\'eventId\' field was not specified!'
                    }
                );
                done();
            })
        });
    });//retrieveEventIds()

    describe('deleteEvent()', function() {
        //Configure timeout for async tests
        beforeEach(function(done) {
            setTimeout(function() {
                value = 0;
                done();
            }, 5000);
        });
        
        it('should be able to delete an existing event', function(done) {
            dbManager.deleteEvent({ "body" :
                    {
                        "eventId" : "unitTestingEvent"
                    }
                }).then( (res) => {
                expect(res).toEqual({
                    "status" : "Success"
                });
                done();
            });
        });

        it('should return an error if a non-existing event is deleted', function(done) {
            dbManager.deleteEvent({ "body" :
                    {
                        "eventId" : "eventthatdoesnotexist"
                    }
                }).catch( (reject) => {
                expect(reject).toEqual({
                    "status" : "Failure",
                    "message" : "Specified event does not exist!"
                });
                done();
            });
        });

        it('should return error when recieving a request with a missing \'body\' field', function(done) {
            dbManager.deleteEvent(
                {
                    "eventId" : "unitTestingEvent"
                }
            ).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'body\' field was not specified!'
                });
                done();
            })
        });

        it('should return error when recieving a request with a missing \'eventId\' field', function(done) {
            dbManager.deleteEvent({ "body" :
                {
                }
            }).catch( (reject) => {
                expect(reject).toEqual( {
                    "status" : "Failure",
                    "message" : '\'eventId\' field was not specified!'
                });
                done();
            })
        });
    });//deleteEvent()
});//Event