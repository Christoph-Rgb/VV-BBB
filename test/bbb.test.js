const chai = require('chai')
const expect = chai.expect
const moment = require('moment');

const BBB = require('../app/BBB.js').BBB;
const fs = require('fs');


describe('IBBBCommand', () => {

  const TEST_FILE_FOLDER = './temp/';
  const TEST_FILE_PATH = TEST_FILE_FOLDER + 'db';

  beforeAll(() => {
    this.spy = jest.spyOn(console, 'log');
  });

  beforeEach(() => {
    try {
      fs.mkdirSync(TEST_FILE_FOLDER);
    } catch (e) {
      if(e.code !== 'EEXIST'){
        throw e;
      }
    };
  });
  afterEach(() => {
    try {
      fs.unlinkSync(TEST_FILE_PATH);
    } catch (e) {
      if(e.code !== 'ENOENT'){
        throw e;
      }
    }
    this.spy.mockClear();
  });

  const getValidDB = () => {
    return [{ id: "R1", source: "Madrid", destination: "Toledo", capacity: 10,
              tickets: [{id: "T_R1_9", "seat": 9, "boarded": false}],
              departed: null,
              availableSeats: [0,1,2,3,4,5,6,7,8]},
            { id: "R2", source: "Barcelona", destination: "Valencia",
              capacity: 10,  tickets: [], departed: null,
              availableSeats: [0,1,2,3,4,5,6,7,8,9]}];
  };

  describe('constructor', () => {

    it('TC_BBB_1: successfully writes file', () => {
      const bbb = new BBB(TEST_FILE_PATH);
      bbb.loadRoutes();
      bbb.parseCommand(["registerroute", "R1", "Madrid", "Toledo", 10]);
      bbb.parseCommand(["registerroute", "R2", "Barcelona", "Valencia", 10]);
      bbb.parseCommand(["buy", "R1"]);
      bbb.saveRoutes();
      console.log(JSON.stringify(getValidDB()));
      const routeObjects = bbb.routes.map((r) => r.toObject());
      console.log(JSON.stringify(routeObjects));
      const data = fs.readFileSync(TEST_FILE_PATH).toString();
      expect(JSON.parse(data)).to.deep.equal(getValidDB());
    }),

    it ('TC_BBB_2: successfully reads file with routes', () => {
      fs.writeFileSync(TEST_FILE_PATH, JSON.stringify(getValidDB()));
      const bbb = new BBB(TEST_FILE_PATH);
      bbb.loadRoutes();
      const routeObjects = bbb.routes.map((r) => r.toObject());
      expect(routeObjects)
        .to.deep.equal(getValidDB());
    }),

    it ('TC_BBB_3: successfully reads without routes', () => {
      fs.writeFileSync(TEST_FILE_PATH, "[]");
      const bbb = new BBB(TEST_FILE_PATH);
      bbb.loadRoutes();
      const routeObjects = bbb.routes.map((r) => r.toObject());

      expect(routeObjects)
        .to.deep.equal([]);
    }),

    it ('TC_BBB_4: does not read not existing file', () => {
      const bbb = new BBB(TEST_FILE_PATH);
      bbb.loadRoutes();
      const routeObjects = bbb.routes.map((r) => r.toObject());

      expect(routeObjects)
        .to.deep.equal([]);
    }),

    it ('TC_BBB_5: fails for no arguments given', () => {
      const bbb = new BBB(TEST_FILE_PATH);
      bbb.loadRoutes();
      bbb.parseCommand([]);
      expect(this.spy.mock.calls).to.deep.equal([['No argument was given']]);
    }),

    it ('TC_BBB_6: fails for not existing command', () => {
      const bbb = new BBB(TEST_FILE_PATH);
      bbb.loadRoutes();
      bbb.parseCommand(["asdf"]);
      expect(this.spy.mock.calls).to.deep.equal([['Command asdf does not exist']]);
    }),

    it ('TC_BBB_7: succeeds for existing command', () => {
      const bbb = new BBB(TEST_FILE_PATH);
      bbb.loadRoutes();
      const commandIndex = bbb._commands.map((c) => c.commandId).indexOf("status");
      let works = false;
      bbb._commands[commandIndex].execute = () => {
        works = true;
      };
      bbb.parseCommand(["status"]);
      expect(works).to.equal(true);
    })

    it ('TC_BBB_8: set routes', () => {

      const bbb1 = new BBB(TEST_FILE_PATH);
      bbb1.loadRoutes();
      bbb1.parseCommand(["registerroute", "R1", "Berlin", "Toledo", 10]);
      const newRoute = bbb1.routes;
      fs.writeFileSync(TEST_FILE_PATH, JSON.stringify(getValidDB()));
      const bbb = new BBB(TEST_FILE_PATH);
      bbb.routes = newRoute;
      const routeObjects = bbb.routes.map((r) => r.toObject());
      const routeObjects1 = newRoute.map((r) => r.toObject());
      expect(routeObjects).to.deep.equal(routeObjects1);

    })
  });

});
