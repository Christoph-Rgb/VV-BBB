import {Ticket} from './Ticket'
import {Route} from './Route'

// const ticket1 = new Ticket("Ticket1", 1)
// console.log(ticket1.id)

// const ticket2 = Ticket.fromJSON('{"id":"Ticket2", "seat":2, "boarded":true}')
// console.log(ticket2.id)

// const ticket3 = new Ticket("Ticket3", 3)
// const json = ticket3.toJSON()
// console.log(json)

// const ticket3Clone = Ticket.fromJSON(json)
// console.log(ticket3Clone.id + "Clone")

let route1 = new Route('R1', 'Madrid', 'Valencia', 50)

const ticket = route1.purchaseTicket().ticket
const ticket2 = route1.purchaseTicket().ticket
const ticket3 = route1.purchaseTicket().ticket

let result1 = route1.boardTicket(ticket2.id)
let result2 = route1.boardTicket('ticket2.id')

let result3 = route1.cancelTicket(ticket2.id)
let result4 = route1.cancelTicket('asldfkj')

const departed = route1.depart()
const hasArrived = route1.hasArrived()

const routeObject = route1.toObject()
const routeJSON = JSON.stringify(routeObject)

const recoveredRotueObject = JSON.parse(routeJSON)
const route1Clone = Route.fromObject(recoveredRotueObject)

console.log("")

