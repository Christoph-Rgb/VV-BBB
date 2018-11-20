const chai = require('chai')
const expect = chai.expect
const moment = require('moment');

const Ticket = require('../app/Ticket').Ticket
const Route = require('../app/Route').Route

const validInitialRoute = {
    id: 'R1',
    source: 'Madrid',
    destination: 'Toledo',
    capacity: 10,
    tickets: [],
    departed: null,
    availableSeats: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
}

const departedRoute = {
    id: 'R1',
    source: 'Madrid',
    destination: 'Toledo',
    capacity: 10,
    tickets: [],
    departed: "2018-11-20T14:41:09.866Z",
    availableSeats: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
}

const invalidId = " "
const invalidSource = " "
const invalidDestination = null
const invalidCapacity = -1

const invalidTicketId = "T1_R1_XXX"

const statusTravelling = "travelling"
const statusAvailable = "available"
const statusEmpty = "empty"
const statusFull = "full"

const validTickets = [
    {
        id: 'T_R1_9',
        seat: 9,
        boarded: false
    },
    {
        id: 'T_R1_8',
        seat: 8,
        boarded: false
    },
    {
        id: 'T_R1_7',
        seat: 7,
        boarded: false
    },
    {
        id: 'T_R1_6',
        seat: 6,
        boarded: false
    },
    {
        id: 'T_R1_5',
        seat: 5,
        boarded: false
    },
    {
        id: 'T_R1_4',
        seat: 4,
        boarded: false
    },
    {
        id: 'T_R1_3',
        seat: 3,
        boarded: false
    },
    {
        id: 'T_R1_2',
        seat: 2,
        boarded: false
    },
    {
        id: 'T_R1_1',
        seat: 1,
        boarded: false
    },
    {
        id: 'T_R1_0',
        seat: 0,
        boarded: false
    },

]

const resultNoTicketsAvailable = 'No tickets available'
const resultTicketDoesNotExist = 'Ticket does not exist'
const resultTicketIsAlreadyBoarded = 'Ticket is already boarded'

describe('Route', () => {

    validateRoute = (route, object) => {
        expect(route.id).to.equal(object.id)
        expect(route.source).to.equal(object.source)
        expect(route.destination).to.equal(object.destination)
        expect(route.capacity).to.equal(object.capacity)
        expect(route._availableSeats).to.deep.equal(object.availableSeats)

        for(const ticketObjectId in object.tickets) {
            const ticketObject = object.tickets[ticketObjectId]

            const ticketId = route.tickets.map(t => t.id).indexOf(ticketObject.id)
            expect(ticketId).to.not.equal(-1)

            const ticket = route.tickets[ticketId]
            validateTicket(ticket, ticketObject)
        }

        if (object.departed === null) {
            expect(route._departed).to.equal(object.departed)
        } else {
            const departed = moment(object.departed)
            expect(departed.isSame(route._departed)).to.equal(true)
        }
    }

    validateTicket = (ticket, object) => {
        expect(ticket.id).to.equal(object.id)
        expect(ticket.seat).to.equal(object.seat)
        expect(ticket.boarded).to.equal(object.boarded)
    }

    validateObjects = (o1, o2) => {
        expect(o1.id).to.equal(o2.id)
        expect(o1.source).to.equal(o2.source)
        expect(o1.destination).to.equal(o2.destination)
        expect(o1.capacity).to.equal(o2.capacity)
        expect(o1.availableSeats).to.deep.equal(o2.availableSeats)

        for(const ticketObjectId in o2.tickets) {
            const ticketObject = o2.tickets[ticketObjectId]

            const ticketId = o1.tickets.map(t => t.id).indexOf(ticketObject.id)
            expect(ticketId).to.not.equal(-1)

            const ticket = o1.tickets[ticketId]
            validateTicket(ticket, ticketObject)
        }

        if (o2.departed === null) {
            expect(o1.departed).to.equal(o2.departed)
        } else {
            const departed = moment(o2.departed)
            expect(departed.isSame(o1.departed)).to.equal(true)
        }
    }

    createValidRoute = () => {
        return new Route(validInitialRoute.id, 
                         validInitialRoute.source, 
                         validInitialRoute.destination, 
                         validInitialRoute.capacity)
    }

    createSpecialRouteObjectFromInitial = (id, source, destination, capacity, tickets, departed, availableSeats) => {
        let route = {
            id: validInitialRoute.id,
            source: validInitialRoute.source,
            destination: validInitialRoute.destination,
            capacity: validInitialRoute.capacity,
            tickets: validInitialRoute.tickets,
            departed: validInitialRoute.departed,
            availableSeats: validInitialRoute.availableSeats
        }

        if (id) route.id = id
        if (source) route.source = source
        if (destination) route.destination = destination
        if (capacity) route.capacity = capacity
        if (tickets) route.tickets = tickets
        if (departed) route.departed = departed
        if (availableSeats) route.availableSeats = availableSeats

        return route
    }

    createTickets = (route, count) => {
        for(let i = 0; i < count; i++) {
            const seat = route._availableSeats.pop()
            route._tickets.push(new Ticket(`T_R1_${seat}`, seat))
        }
    }

    cloneValidTickets = () => {
        let clones = []

        validTickets.forEach(t => clones.push({
            id: t.id,
            seat: t.seat,
            boarded: t.boarded
        }))

        return clones
    }

    describe('constructor', () => {

        it('TC_Route_1: initializes correctly', () => {
            //act
            const route = createValidRoute()

            //assert
            validateRoute(route, validInitialRoute)
        }),

        it ('TC_Route_2: throws error on invalid id', () => {
            expect(() => {
                const route = new Route(invalidId, 
                                        validInitialRoute.source, 
                                        validInitialRoute.destination, 
                                        validInitialRoute.capacity)})
                .throws('Invalid id')
        }),

        it ('TC_Route_3: throws error on invalid source', () => {
            expect(() => {
                const route = new Route(validInitialRoute.id, 
                                        invalidSource, 
                                        validInitialRoute.destination, 
                                        validInitialRoute.capacity)})
                .throws('Invalid source')
        }),

        it ('TC_Route_4: throws error on invalid destination', () => {
            expect(() => {
                const route = new Route(validInitialRoute.id, 
                                        validInitialRoute.source, 
                                        invalidDestination, 
                                        validInitialRoute.capacity)})
                .throws('Invalid destination')
        }),

        it ('TC_Route_5: throws error on invalid capacity', () => {
            expect(() => {
                const route = new Route(validInitialRoute.id, 
                                        validInitialRoute.source, 
                                        validInitialRoute.destination, 
                                        invalidCapacity)})
                .throws('Invalid capacity')
        })
    }),

    describe('status', () => {

        it('TC_Route_6: returns status "travelling" on travelling', () => {
            //arrange
            const route = createValidRoute()
            route._departed = moment()

            //act
            const status = route.status

            //assert
            expect(status).to.equal(statusTravelling)
        }),

        it('TC_Route_7: returns status "empty" on empty', () => {
            //arrange
            const route = createValidRoute()

            //act
            const status = route.status

            //assert
            expect(status).to.equal(statusEmpty)
        }),

        it('TC_Route_8: returns status "available" on available', () => {
            //arrange
            let route = createValidRoute()
            createTickets(route, 1)

            //act
            const status = route.status

            //assert
            expect(status).to.equal(statusAvailable)
        }),

        it('TC_Route_9: returns status "full" on full', () => {
            //arrange
            let route = createValidRoute()
            createTickets(route, 10)

            //act
            const status = route.status

            //assert
            expect(status).to.equal(statusFull)
        })
    })

    describe('purchaseTicket', () => {

        it('TC_Route_10: sucessfully purchase ticket', () => {
            //arrange
            const route = createValidRoute()

            //act
            const result = route.purchaseTicket()

            //assert
            expect(result.success).to.equal(true)
            validateTicket(result.ticket, validTickets[0])

            const expectedRoute = createSpecialRouteObjectFromInitial(
                null,
                null,
                null,
                null,
                [validTickets[0]],
                null,
                [0, 1, 2, 3, 4, 5, 6, 7, 8]
            )
            validateRoute(route, expectedRoute)
        }),

        it('TC_Route_11: purchase ticket fails on no available tickets', () => {
            //arrange
            let route = createValidRoute()
            createTickets(route, 10)

            //act
            const result = route.purchaseTicket()

            //assert
            expect(result.success).to.equal(false)
            expect(result.reason).to.equal(resultNoTicketsAvailable)

            const expectedRoute = createSpecialRouteObjectFromInitial(
                null,
                null,
                null,
                null,
                validTickets,
                null,
                [],
            )
            validateRoute(route, expectedRoute)
        })
    }),

    describe('boardTicket', () => {

        it('TC_Route_12: successfully board ticket', () => {
            //arrange
            let route = createValidRoute()
            createTickets(route, 10)

            const tickets = cloneValidTickets()
            const expectedTicket = tickets[0]
            expectedTicket.boarded = true

            //act
            const result = route.boardTicket(expectedTicket.id)

            //assert
            expect(result.success).to.equal(true)
            validateTicket(result.ticket, expectedTicket)
            const expectedRoute = createSpecialRouteObjectFromInitial(
                null,
                null,
                null,
                null,
                tickets,
                null,
                [],
            )
            validateRoute(route, expectedRoute)
        }),

        it('TC_Route_13: board ticket fails for invalid ticketId', () => {
            //arrange
            let route = createValidRoute()
            createTickets(route, 10)

            //act
            const result = route.boardTicket(invalidTicketId)

            //assert
            expect(result.success).to.equal(false)
            expect(result.reason).to.equal(resultTicketDoesNotExist)
            const expectedRoute = createSpecialRouteObjectFromInitial(
                null,
                null,
                null,
                null,
                validTickets,
                null,
                [],
            )
            validateRoute(route, expectedRoute)
        }),

        it('TC_Route_14: boarded ticket fails for already boarded ticketId', () => {
            //arrange
            let route = createValidRoute()
            createTickets(route, 10)
            const tickets = cloneValidTickets()
            tickets[0].boarded = true
            route.tickets[0].boarded = true

            //act
            const result = route.boardTicket(route.tickets[0].id)

            //assert
            expect(result.success).to.equal(false)
            expect(result.reason).to.equal(resultTicketIsAlreadyBoarded)
            const expectedRoute = createSpecialRouteObjectFromInitial(
                null,
                null,
                null,
                null,
                tickets,
                null,
                [],
            )
            validateRoute(route, expectedRoute)
        })
    }),

    describe('cancelTicket', () => {

        it('TC_Route_15: successfully cancel ticket', () => {
            //arrange
            let route = createValidRoute()
            createTickets(route, 10)
            let tickets = cloneValidTickets()
            tickets.shift()

            //act
            const result = route.cancelTicket(validTickets[0].id)

            //assert
            expect(result.success).to.equal(true)
            validateTicket(result.ticket, validTickets[0])
            const expectedRoute = createSpecialRouteObjectFromInitial(
                null,
                null,
                null,
                null,
                tickets,
                null,
                [9],
            )
            validateRoute(route, expectedRoute)
        }),

        it('TC_Route_16: cancel ticket fails for invalid ticketId', () => {
            //arrange
            let route = createValidRoute()
            createTickets(route, 10)

            //act
            const result = route.cancelTicket(invalidTicketId)

            //assert
            expect(result.success).to.equal(false)
            expect(result.reason).to.equal(resultTicketDoesNotExist)
            const expectedRoute = createSpecialRouteObjectFromInitial(
                null,
                null,
                null,
                null,
                validTickets,
                null,
                [],
            )
            validateRoute(route, expectedRoute)
        }),

        it('TC_Route_17: cancel ticket fails for already boarded ticketId', () => {
            //arrange
            let route = createValidRoute()
            createTickets(route, 10)
            route.tickets[0].boarded = true

            const tickets = cloneValidTickets()
            tickets[0].boarded = true

            //act
            const result = route.cancelTicket(tickets[0].id)

            //assert
            expect(result.success).to.equal(false)
            expect(result.reason).to.equal(resultTicketIsAlreadyBoarded)
            const expectedRoute = createSpecialRouteObjectFromInitial(
                null,
                null,
                null,
                null,
                tickets,
                null,
                [],
            )
            validateRoute(route, expectedRoute)
        })
    }),

    describe('depart', () => {

        it('TC_Route_18: depart successfully sets departure time', () => {
            //arrange
            let route = createValidRoute()
            expect(route._departed).to.equal(null)

            //act
            route.depart()

            //assert
            expect(route._departed).to.not.equal(null)
            expect(route._departed.isValid()).to.equal(true)
            expect(route._departed.isAfter(moment().subtract(10, 'seconds')))
            const expectedRoute = createSpecialRouteObjectFromInitial(
                null,
                null,
                null,
                null,
                null,
                route._departed,
                null
            )
            validateRoute(route, expectedRoute)

        })
    }),

    describe('hasArrived', () => {

        it ('TC_Route_19 hasArrived successfully resets the Route', () => {
            //arrange
            let route = createValidRoute()
            createTickets(route, 10)
            route._departed = moment().subtract(10, 'seconds')

            //act
            const result = route.hasArrived()

            //assert
            expect(result).to.equal(true)
            const expectedRoute = createSpecialRouteObjectFromInitial(
                null,
                validInitialRoute.destination,
                validInitialRoute.source,
                null,
                [],
                null,
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            )
            validateRoute(route, expectedRoute)
        }),

        it('TC_Route_20: hasArrived does not reset the Route if not departed yet', () => {
            //arrange
            let route = createValidRoute()
            createTickets(route, 10)

            //act
            const result = route.hasArrived()

            //assert
            expect(result).to.equal(false)
            const expectedRoute = createSpecialRouteObjectFromInitial(
                null,
                null,
                null,
                null,
                validTickets,
                null,
                []
            )
            validateRoute(route, expectedRoute)
        }),

        it('TC_Route_21: hasArrived does not reset route if still travelling', () => {
            //arrange
            let route = createValidRoute()
            createTickets(route, 10)
            route._departed = moment()

            //act
            const result = route.hasArrived()

            //assert
            expect(result).to.equal(false)
            const expectedRoute = createSpecialRouteObjectFromInitial(
                null,
                null,
                null,
                null,
                validTickets,
                route._departed,
                []
            )
            validateRoute(route, expectedRoute)
        })
    }),

    describe('fromObject', () => {

        it('TC_Route_22: fromObject successfully creates new Route with set departure', () => {
            //act
            let tickets = cloneValidTickets()
            tickets.pop()
            tickets.pop()
            tickets.pop()
            const routeObject = createSpecialRouteObjectFromInitial(
                null,
                null,
                null,
                null,
                tickets,
                departedRoute.departed,
                [0, 1, 2]
            )

            const route = Route.fromObject(routeObject)

            //assert
            validateRoute(route, routeObject)
        }),

        it('TC_Route_23: fromObject successfully creates new Route without set departure and tickets', () => {
            //act
            const route = Route.fromObject(validInitialRoute)

            //assert
            validateRoute(route, validInitialRoute)


        })
    }),

    describe('toObject', () => {

        it('TC_Route_24: toObject successfully creates new Object with set departure', () => {
            //arrange
            const departed = moment()
            let tickets = cloneValidTickets()
            tickets.pop()
            tickets.pop()
            tickets.pop()
            const expectedObject = createSpecialRouteObjectFromInitial(
                null,
                null,
                null,
                null,
                tickets,
                departed,
                [0, 1, 2]
            )

            let route = createValidRoute()
            createTickets(route, 7)
            route._departed = departed

            //act
            const routeObject = route.toObject()

            //assert
            validateObjects(routeObject, expectedObject)
        }),

        it('TC_Route_25: toObject successfully creates new Object without departure', () => {
            //arrange
            let tickets = cloneValidTickets()
            tickets.pop()
            tickets.pop()
            tickets.pop()
            const expectedObject = createSpecialRouteObjectFromInitial(
                null,
                null,
                null,
                null,
                tickets,
                null,
                [0, 1, 2]
            )

            let route = createValidRoute()
            createTickets(route, 7)

            //act
            const routeObject = route.toObject()

            //assert
            validateObjects(routeObject, expectedObject)
        })

    })

})