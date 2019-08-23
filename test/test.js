const Jasmine = require("jasmine");
let jasmine = new Jasmine();
jasmine.loadConfigFile('./spec/support/jasmine.json');
jasmine.execute();
