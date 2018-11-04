"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Route_1 = require("./Route");
// const ticket1 = new Ticket("Ticket1", 1)
// console.log(ticket1.id)
// const ticket2 = Ticket.fromJSON('{"id":"Ticket2", "seat":2, "boarded":true}')
// console.log(ticket2.id)
// const ticket3 = new Ticket("Ticket3", 3)
// const json = ticket3.toJSON()
// console.log(json)
// const ticket3Clone = Ticket.fromJSON(json)
// console.log(ticket3Clone.id + "Clone")
var route1 = new Route_1.Route('R1', 'Madrid', 'Valencia', 50);
var ticket = route1.purchaseTicket().ticket;
var ticket2 = route1.purchaseTicket().ticket;
var ticket3 = route1.purchaseTicket().ticket;
var result1 = route1.boardTicket(ticket2.id);
var result2 = route1.boardTicket('ticket2.id');
var result3 = route1.cancelTicket(ticket2.id);
var result4 = route1.cancelTicket('asldfkj');
var departed = route1.depart();
var hasArrived = route1.hasArrived();
var routeObject = route1.toObject();
var routeJSON = JSON.stringify(routeObject);
var recoveredRotueObject = JSON.parse(routeJSON);
var route1Clone = Route_1.Route.fromObject(recoveredRotueObject);
console.log("");
//# sourceMappingURL=BBB.js.map