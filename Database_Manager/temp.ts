import manager from './databaseManager';

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