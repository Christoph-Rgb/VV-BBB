import {Ticket} from './Ticket'

const ticket1 = new Ticket("Ticket1", 1)
console.log(ticket1.id)

const ticket2 = Ticket.fromJSON('{"id":"Ticket2", "seat":2, "boarded":true}')
console.log(ticket2.id)

const ticket3 = new Ticket("Ticket3", 3)
const json = ticket3.toJSON()
console.log(json)

const ticket3Clone = Ticket.fromJSON(json)
console.log(ticket3Clone.id + "Clone")
