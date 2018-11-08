"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IBBBCommand_1 = require("./IBBBCommand");
var filePath = './.bbb_data';
var BBB = /** @class */ (function () {
    function BBB() {
        var _this = this;
        this.saveRoutes = function () {
            var routeObjects = _this._routes.map(function (r) { return r.toObject(); });
            var json = JSON.stringify(routeObjects);
            //TODO: save json to filePath
        };
        this.loadRoutes = function () {
            _this._routes = new Array();
            //TODO: load routesObjects
            //for each routeObject call Routes.fromObject and push to this._routes
        };
        this._commands = new Array();
        this._commands.push(new IBBBCommand_1.RegisterRouteCommand('registerroute', this));
        this.loadRoutes();
        this.parseCommand();
        this.saveRoutes();
    }
    Object.defineProperty(BBB.prototype, "routes", {
        get: function () {
            return this._routes;
        },
        enumerable: true,
        configurable: true
    });
    BBB.prototype.parseCommand = function () {
        var args = process.argv;
        args.shift();
        args.shift();
        if (args.length === 0) {
            console.log('No argument was given');
            return;
        }
        var commandId = args.shift();
        var commandIndex = this._commands.map(function (c) { return c.commandId; }).indexOf(commandId);
        if (commandIndex === -1) {
            console.log("Command " + commandId + " does not exist");
            return;
        }
        var command = this._commands[commandIndex];
        command.execute(args);
    };
    return BBB;
}());
exports.BBB = BBB;
var bbb = new BBB();
// const ticket1 = new Ticket("Ticket1", 1)
// console.log(ticket1.id)
// const ticket2 = Ticket.fromJSON('{"id":"Ticket2", "seat":2, "boarded":true}')
// console.log(ticket2.id)
// const ticket3 = new Ticket("Ticket3", 3)
// const json = ticket3.toJSON()
// console.log(json)
// const ticket3Clone = Ticket.fromJSON(json)
// console.log(ticket3Clone.id + "Clone")
// let route1 = new Route('R1', 'Madrid', 'Valencia', 50)
// const ticket = route1.purchaseTicket().ticket
// const ticket2 = route1.purchaseTicket().ticket
// const ticket3 = route1.purchaseTicket().ticket
// let result1 = route1.boardTicket(ticket2.id)
// let result2 = route1.boardTicket('ticket2.id')
// let result3 = route1.cancelTicket(ticket2.id)
// let result4 = route1.cancelTicket('asldfkj')
// const departed = route1.depart()
// const hasArrived = route1.hasArrived()
// const routeObject = route1.toObject()
// const routeJSON = JSON.stringify(routeObject)
// const recoveredRotueObject = JSON.parse(routeJSON)
// const route1Clone = Route.fromObject(recoveredRotueObject)
// console.log("")
//# sourceMappingURL=BBB.js.map