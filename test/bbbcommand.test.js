const chai = require('chai')
const expect = chai.expect
const moment = require('moment');

const Route = require('../app/Route').Route
const RegisterRouteCommand = require('../app/IBBBCommand').RegisterRouteCommand
const DeleteRouteCommand = require('../app/IBBBCommand').DeleteRouteCommand
const DepartCommand = require('../app/IBBBCommand').DepartCommand
const StatusCommand = require('../app/IBBBCommand').StatusComamnd
const BuyCommand = require('../app/IBBBCommand').BuyCommand
const CheckinCommand = require('../app/IBBBCommand').CheckinCommand
const CancelCommand = require('../app/IBBBCommand').CancelCommand

const initialRouteMadridToledo = {
    id: 'R1',
    source: 'Madrid',
    destination: 'Toledo',
    capacity: 10,
    tickets: [],
    departed: null,
    availableSeats: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
}

const routeMadridToledoWithOneTicket = {
    id: 'R1',
    source: 'Madrid',
    destination: 'Toledo',
    capacity: 10,
    tickets: [{ id: 'T_R1_9', seat: 9, boarded: false}],
    departed: null,
    availableSeats: [0, 1, 2, 3, 4, 5, 6, 7, 8]
}

const routeMadridToledoWithTenTicket = {
    id: 'R1',
    source: 'Madrid',
    destination: 'Toledo',
    capacity: 10,
    tickets: [{ id: 'T_R1_9', seat: 9, boarded: false},
              { id: 'T_R1_8', seat: 8, boarded: false},
              { id: 'T_R1_7', seat: 7, boarded: false},
              { id: 'T_R1_6', seat: 6, boarded: false},
              { id: 'T_R1_5', seat: 5, boarded: false},
              { id: 'T_R1_4', seat: 4, boarded: false},
              { id: 'T_R1_3', seat: 3, boarded: false},
              { id: 'T_R1_2', seat: 2, boarded: false},
              { id: 'T_R1_1', seat: 1, boarded: false},
              { id: 'T_R1_0', seat: 0, boarded: false}
            ],
    departed: null,
    availableSeats: []
}

const initialRouteBarcelonaValencia = {
    id: 'R2',
    source: 'Barcelona',
    destination: 'Valencia',
    capacity: 10,
    tickets: [],
    departed: null,
    availableSeats: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
}

describe('IBBBCommand', () => {

    beforeAll(() => {
        this.spy = jest.spyOn(console, 'log');
        jest.spyOn(process, 'exit').mockImplementationOnce(() => {
          throw new Error('process.exit() was called.')
        });
    })

    afterEach(() => {
        this.spy.mockClear()
    })

    mockBBBWithNoRoutes = () => {
        return { routes: [] }
    }

    mockBBBWithRoutes = (routeObjects) => {
        let bbb = {
            routes: []
        }

        routeObjects.forEach(ro => {
            bbb.routes.push(Route.fromObject(ro))
        });

        return bbb
    } 

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

    cloneRouteObject = (routeObject) => {
        let tickets = []
        routeObject.tickets.forEach(ticket => {
            tickets.push({
                id: ticket.id,
                seat: ticket.seat,
                boarded: ticket.boarded
            })
        })

        let availableSeats = []
        routeObject.availableSeats.forEach(seat => {
            availableSeats.push(seat)
        })

        return {
            id: routeObject.id,
            source: routeObject.source,
            destination: routeObject.destination,
            capacity: routeObject.capacity,
            tickets: tickets,
            departed: routeObject.departed,
            availableSeats: availableSeats
        }
    }

    describe('RegisterRouteCommand', () => {
    
        it('TC_RegisterRouteCommand_1: returns corred id', () => {
            //arrange
            const bbb = mockBBBWithNoRoutes()
            const cmd = new RegisterRouteCommand(bbb)

            //assert
            expect(cmd.commandId).to.equal('registerroute')
        }),
    
        it('TC_RegisterRouteCommand_2: fails for invalid number of arguments', () => {
            //arrange
            const bbb = mockBBBWithNoRoutes()
            const cmd = new RegisterRouteCommand(bbb)
    
            //act
            cmd.execute([])
    
            //assert
            expect(this.spy.mock.calls).to.deep.equal([['Invalid number of arguments given']]);
            expect(bbb.routes).to.deep.equal([])
    
        }),

        it('TC_RegisterRouteCommand_3: fails for invalid route', () => {
            //arrange
            const bbb = mockBBBWithNoRoutes()
            const cmd = new RegisterRouteCommand(bbb)

            //act
            cmd.execute([" ", "Madrid", "Toledo", 10])
    
            //assert
            expect(this.spy.mock.calls).to.deep.equal([['Invalid value for route given']]);
            expect(bbb.routes).to.deep.equal([])
    
        }),

        it('TC_RegisterRouteCommand_4: fails for invalid source', () => {
            //arrange
            const bbb = mockBBBWithNoRoutes()
            const cmd = new RegisterRouteCommand(bbb)

            //act
            cmd.execute(["R1", null, "Toledo", 10])
    
            //assert
            expect(this.spy.mock.calls).to.deep.equal([['Invalid value for source given']]);
            expect(bbb.routes).to.deep.equal([])
    
        }),

        it('TC_RegisterRouteCommand_5: fails for invalid destination', () => {
            //arrange
            const bbb = mockBBBWithNoRoutes()
            const cmd = new RegisterRouteCommand(bbb)

            //act
            cmd.execute(["R1", "Madrid", undefined, 10])
    
            //assert
            expect(this.spy.mock.calls).to.deep.equal([['Invalid value for destination given']]);
            expect(bbb.routes).to.deep.equal([])
    
        }),

        it('TC_RegisterRouteCommand_6: fails for invalid capacity', () => {
            //arrange
            const bbb = mockBBBWithNoRoutes()
            const cmd = new RegisterRouteCommand(bbb)

            //act
            cmd.execute(["R1", "Madrid", "Toledo", "asdf"])
    
            //assert
            expect(this.spy.mock.calls).to.deep.equal([['Invalid value for capacity given']]);
            expect(bbb.routes).to.deep.equal([])
    
        }),

        it('TC_RegisterRouteCommand_7: succeeds for valid input', () => {
            //arrange
            const bbb = mockBBBWithNoRoutes()
            const cmd = new RegisterRouteCommand(bbb)

            //act
            cmd.execute(["R1", "Madrid", "Toledo", 10])
    
            //assert
            expect(this.spy.mock.calls).to.deep.equal([['Created route R1 from Madrid to Toledo with 10 seats']]);
            expect(bbb.routes.length).to.equal(1)
            validateRoute(bbb.routes[0], initialRouteMadridToledo)
    
        })
    
    }),

    describe('DeleteRouteCommand', () => {

        it('TC_DeleteRouteCommand_1: returns correct id', () => {
            //arrange
            const bbb = mockBBBWithNoRoutes()
            const cmd = new DeleteRouteCommand(bbb)

            //assert
            expect(cmd.commandId).to.equal('deleteroute')
        }),

        it('TC_DeleteRouteCommand_2: fails for invalid number of arguments', () => {
            //arrange
            const bbb = mockBBBWithRoutes([cloneRouteObject(routeMadridToledoWithOneTicket)])
            const cmd = new DeleteRouteCommand(bbb)

            //act
            cmd.execute([])

            //assert
            expect(this.spy.mock.calls).to.deep.equal([['Invalid number of arguments given']]);
            expect(bbb.routes.length).to.equal(1)
            validateRoute(bbb.routes[0], routeMadridToledoWithOneTicket)
        }),

        it('TC_DeleteRouteCommand_3: fails for invalid route', () => {
            //arrange
            const bbb = mockBBBWithRoutes([cloneRouteObject(routeMadridToledoWithOneTicket)])
            const cmd = new DeleteRouteCommand(bbb)

            //act
            cmd.execute([" "])

            //assert
            expect(this.spy.mock.calls).to.deep.equal([['Invalid value for route given']]);
            expect(bbb.routes.length).to.equal(1)
            validateRoute(bbb.routes[0], routeMadridToledoWithOneTicket)
        }),

        it('TC_DeleteRouteCommand_4: fails for route with purchased tickets', () => {
            //arrange
            const bbb = mockBBBWithRoutes([cloneRouteObject(routeMadridToledoWithOneTicket)])
            const cmd = new DeleteRouteCommand(bbb)

            //act
            cmd.execute(["R1"])

            //assert
            expect(this.spy.mock.calls).to.deep.equal([['Cannot delete route R1 because there are 1 tickets booked']]);
            expect(bbb.routes.length).to.equal(1)
            validateRoute(bbb.routes[0], routeMadridToledoWithOneTicket)
        }),

        it('TC_DeleteRouteCommand_5: succeeds for valid input', () => {
            //arrange
            const bbb = mockBBBWithRoutes([cloneRouteObject(initialRouteMadridToledo)])
            const cmd = new DeleteRouteCommand(bbb)

            //act
            cmd.execute(["R1"])

            //assert
            expect(this.spy.mock.calls).to.deep.equal([['Successfully deleted route R1']]);
            expect(bbb.routes.length).to.equal(0)
        })
    }),

    describe('DepartCommand', () => {
        it('TC_DepartCommand_1: returns correct id', () => {
            //arrange
            const bbb = mockBBBWithNoRoutes()
            const cmd = new DepartCommand(bbb)

            //assert
            expect(cmd.commandId).to.equal('depart')
        }),

        it('TC_DepartCommand_2: fails for invalid number of arguments', () => {
            //arrange
            const bbb = mockBBBWithRoutes([cloneRouteObject(routeMadridToledoWithOneTicket)])
            const cmd = new DepartCommand(bbb)

            //act
            cmd.execute([])

            //assert
            expect(this.spy.mock.calls).to.deep.equal([['Invalid number of arguments given']]);
            expect(bbb.routes.length).to.equal(1)
            validateRoute(bbb.routes[0], cloneRouteObject(routeMadridToledoWithOneTicket))
        }),

        it('TC_DepartCommand_3: fails for invalid route', () => {
            //arrange
            const bbb = mockBBBWithRoutes([cloneRouteObject(routeMadridToledoWithOneTicket)])
            const cmd = new DepartCommand(bbb)

            //act
            cmd.execute(["R_X"])

            //assert
            expect(this.spy.mock.calls).to.deep.equal([['Invalid value for route given']]);
            expect(bbb.routes.length).to.equal(1)
            validateRoute(bbb.routes[0], routeMadridToledoWithOneTicket)
        })

        it('TC_DepartCommand_4: succeeds for valid route', () => {
            //arrange
            const bbb = mockBBBWithRoutes([cloneRouteObject(routeMadridToledoWithOneTicket)])
            const cmd = new DepartCommand(bbb)

            //act
            cmd.execute(["R1"])

            //assert
            expect(this.spy.mock.calls).to.deep.equal([['R1 departed']]);
            expect(bbb.routes.length).to.equal(1)

            let expectedRoute = cloneRouteObject(routeMadridToledoWithOneTicket)
            expectedRoute.departed = bbb.routes[0]._departed
            validateRoute(bbb.routes[0], expectedRoute)
        })
    }),

    describe('StatusCommand', () => {

        it('TC_StatusCommand_1: returns correct id', () => {
            //arrange
            const bbb = mockBBBWithNoRoutes()
            const cmd = new StatusCommand(bbb)

            //assert
            expect(cmd.commandId).to.equal('status')
        }),

        it('TC_StatusCommand_2: fails for invalid number of arguments', () => {
            //arrange
            const bbb = mockBBBWithRoutes([cloneRouteObject(routeMadridToledoWithOneTicket), cloneRouteObject(initialRouteBarcelonaValencia)])
            const cmd = new StatusCommand(bbb)

            //act
            cmd.execute(["A", "B"])

            //assert
            expect(this.spy.mock.calls).to.deep.equal([['Invalid number of arguments given']]);
            expect(bbb.routes.length).to.equal(2)
            validateRoute(bbb.routes[0], routeMadridToledoWithOneTicket)
            validateRoute(bbb.routes[1], initialRouteBarcelonaValencia)
        }),

        it('TC_StatusCommand_3: does not print anything when specifying not existing route', () => {
            //arrange
            const bbb = mockBBBWithRoutes([cloneRouteObject(routeMadridToledoWithOneTicket), cloneRouteObject(initialRouteBarcelonaValencia)])
            const cmd = new StatusCommand(bbb)

            //act
            cmd.execute(["R3"])

            //assert
            expect(this.spy.mock.calls).to.deep.equal([['Route R3 does not exist']]);
            expect(bbb.routes.length).to.equal(2)
            validateRoute(bbb.routes[0], routeMadridToledoWithOneTicket)
            validateRoute(bbb.routes[1], initialRouteBarcelonaValencia)
        })

        it('TC_StatusCommand_4: prints status of one specified route successfully', () => {
            //arrange
            const bbb = mockBBBWithRoutes([cloneRouteObject(routeMadridToledoWithOneTicket), cloneRouteObject(initialRouteBarcelonaValencia)])
            const cmd = new StatusCommand(bbb)

            //act
            cmd.execute(["R2"])

            //assert
            expect(this.spy.mock.calls).to.deep.equal([['R2: empty']]);
            expect(bbb.routes.length).to.equal(2)
            validateRoute(bbb.routes[0], routeMadridToledoWithOneTicket)
            validateRoute(bbb.routes[1], initialRouteBarcelonaValencia)
        }),

        it('TC_StatusCommand_5: prints status without specified route successfully', () => {
            //arrange
            const bbb = mockBBBWithRoutes([cloneRouteObject(routeMadridToledoWithOneTicket), cloneRouteObject(initialRouteBarcelonaValencia)])
            const cmd = new StatusCommand(bbb)

            //act
            cmd.execute([])

            //assert
            expect(this.spy.mock.calls).to.deep.equal([['R1: available'], ['R2: empty']]);
            expect(bbb.routes.length).to.equal(2)
            validateRoute(bbb.routes[0], routeMadridToledoWithOneTicket)
            validateRoute(bbb.routes[1], initialRouteBarcelonaValencia)
        })

    }),

    describe('BuyCommand', () => {

        it('TC_BuyCommand_1: returns correct id', () => {
            //arrange
            const bbb = mockBBBWithNoRoutes()
            const cmd = new BuyCommand(bbb)

            //assert
            expect(cmd.commandId).to.equal('buy')
        }),

        it('TC_BuyCommand_2: fails for not existing route', () => {
            //arrange
            const bbb = mockBBBWithRoutes([cloneRouteObject(routeMadridToledoWithOneTicket), cloneRouteObject(initialRouteBarcelonaValencia)])
            const cmd = new BuyCommand(bbb)

            //act
            cmd.execute(["R3"])

            //assert
            expect(this.spy.mock.calls).to.deep.equal([['Route R3 does not exist']]);
            expect(bbb.routes.length).to.equal(2)
            validateRoute(bbb.routes[0], routeMadridToledoWithOneTicket)
            validateRoute(bbb.routes[1], initialRouteBarcelonaValencia)
        }),

        it('TC_BuyCommand_3: fails for sold out route', () => {
            //arrange
            const bbb = mockBBBWithRoutes([cloneRouteObject(routeMadridToledoWithTenTicket), cloneRouteObject(initialRouteBarcelonaValencia)])
            const cmd = new BuyCommand(bbb)

            //act
            cmd.execute(["R1"])

            //assert
            expect(this.spy.mock.calls).to.deep.equal([['Sorry! You were too late! Tickets are sold out']]);
            expect(bbb.routes.length).to.equal(2)
            validateRoute(bbb.routes[0], routeMadridToledoWithTenTicket)
            validateRoute(bbb.routes[1], initialRouteBarcelonaValencia)
        }),

        it('TC_BuyCommand_4: succeeds for valid route', () => {
            //arrange
            const bbb = mockBBBWithRoutes([cloneRouteObject(routeMadridToledoWithOneTicket), cloneRouteObject(initialRouteBarcelonaValencia)])
            const cmd = new BuyCommand(bbb)

            //act
            cmd.execute(["R1"])

            //assert
            expect(this.spy.mock.calls).to.deep.equal([['Successfully purchased ticket T_R1_8 on route R1 from Madrid to Toledo']]);
            expect(bbb.routes.length).to.equal(2)

            let expectedRoute = cloneRouteObject(routeMadridToledoWithOneTicket)
            expectedRoute.availableSeats.pop()
            expectedRoute.tickets.push({ id: 'T_R1_8', seat: 8, boarded: false })

            validateRoute(bbb.routes[0], expectedRoute)
            validateRoute(bbb.routes[1], initialRouteBarcelonaValencia)
        })

    }),

    describe('CheckinCommand', () => {

        it('TC_CheckinCommand_1: returns correct id', () => {
            //arrange
            const bbb = mockBBBWithNoRoutes()
            const cmd = new CheckinCommand(bbb)

            //assert
            expect(cmd.commandId).to.equal('checkin')
        }),

        it('TC_CheckinCommand_2: fails for invalid number of arguments', () => {
            //arrange
            const bbb = mockBBBWithRoutes([cloneRouteObject(routeMadridToledoWithOneTicket)])
            const cmd = new CheckinCommand(bbb)

            //act
            cmd.execute([])

            //assert
            expect(this.spy.mock.calls).to.deep.equal([['Invalid number of arguments given']]);
            expect(bbb.routes.length).to.equal(1)
            validateRoute(bbb.routes[0], routeMadridToledoWithOneTicket)
        })

        it('TC_CheckinCommand_3: fails for invalid value for ticket', () => {
            //arrange
            const bbb = mockBBBWithRoutes([cloneRouteObject(routeMadridToledoWithOneTicket)])
            const cmd = new CheckinCommand(bbb)

            //act
            cmd.execute([' '])

            //assert
            expect(this.spy.mock.calls).to.deep.equal([['Invalid value for ticket given']]);
            expect(bbb.routes.length).to.equal(1)
            validateRoute(bbb.routes[0], routeMadridToledoWithOneTicket)
        }),

        it('TC_CheckinCommand_4: fails for not existing ticket', () => {
            //arrange
            const bbb = mockBBBWithRoutes([cloneRouteObject(routeMadridToledoWithOneTicket)])
            const cmd = new CheckinCommand(bbb)

            //act
            cmd.execute(['T_R1_X'])

            //assert
            expect(this.spy.mock.calls).to.deep.equal([['Ticket with id T_R1_X does not exist']]);
            expect(bbb.routes.length).to.equal(1)
            validateRoute(bbb.routes[0], routeMadridToledoWithOneTicket)
        }),

        it('TC_CheckinCommand_5: fails for already boarded ticket', () => {
            //arrange
            const route = cloneRouteObject(routeMadridToledoWithOneTicket)
            route.tickets[0].boarded = true

            const bbb = mockBBBWithRoutes([route])
            const cmd = new CheckinCommand(bbb)

            //act
            cmd.execute(['T_R1_9'])

            //assert
            expect(this.spy.mock.calls).to.deep.equal([['Unable to checkin ticket T_R1_9: Ticket is already boarded']]);
            expect(bbb.routes.length).to.equal(1)
            validateRoute(bbb.routes[0], routeMadridToledoWithOneTicket)
        }),

        it('TC_CheckinCommand_6: succeeds for valid ticket', () => {
            //arrange
            const bbb = mockBBBWithRoutes([cloneRouteObject(routeMadridToledoWithOneTicket)])
            const cmd = new CheckinCommand(bbb)

            //act
            cmd.execute(['T_R1_9'])

            //assert
            expect(this.spy.mock.calls).to.deep.equal([['Successfully checked in ticket T_R1_9 on route R1 from Madrid to Toledo and assigned seat 9']]);
            expect(bbb.routes.length).to.equal(1)

            const expectedRoute = cloneRouteObject(routeMadridToledoWithOneTicket)
            expectedRoute.tickets[0].boarded = true
            validateRoute(bbb.routes[0], expectedRoute)
        })

    }),

    describe('CancelCommand', () => {

        it('TC_BuyCommand_1: returns correct id', () => {
            //arrange
            const bbb = mockBBBWithNoRoutes()
            const cmd = new CancelCommand(bbb)

            //assert
            expect(cmd.commandId).to.equal('cancel')
        }),

        it('TC_CancelCommand_2: fails for invalid number of arguments', () => {
            //arrange
            const bbb = mockBBBWithRoutes([cloneRouteObject(routeMadridToledoWithOneTicket)])
            const cmd = new CancelCommand(bbb)

            //act
            cmd.execute([])

            //assert
            expect(this.spy.mock.calls).to.deep.equal([['Invalid number of arguments given']]);
            expect(bbb.routes.length).to.equal(1)
            validateRoute(bbb.routes[0], routeMadridToledoWithOneTicket)
        }),

        it('TC_CancelCommand_3: fails for invalid value for ticket', () => {
            //arrange
            const bbb = mockBBBWithRoutes([cloneRouteObject(routeMadridToledoWithOneTicket)])
            const cmd = new CancelCommand(bbb)

            //act
            cmd.execute([' '])

            //assert
            expect(this.spy.mock.calls).to.deep.equal([['Invalid value for ticket given']]);
            expect(bbb.routes.length).to.equal(1)
            validateRoute(bbb.routes[0], routeMadridToledoWithOneTicket)
        }),

        it('TC_CancelCommand_4: fails for not existing ticket', () => {
            //arrange
            const bbb = mockBBBWithRoutes([cloneRouteObject(routeMadridToledoWithOneTicket)])
            const cmd = new CancelCommand(bbb)

            //act
            cmd.execute(['T_R1_X'])

            //assert
            expect(this.spy.mock.calls).to.deep.equal([['Ticket with id T_R1_X does not exist']]);
            expect(bbb.routes.length).to.equal(1)
            validateRoute(bbb.routes[0], routeMadridToledoWithOneTicket)
        }),

        it('TC_CancelCommand_5: fails for already boarded ticket', () => {
            //arrange
            const route = cloneRouteObject(routeMadridToledoWithOneTicket)
            route.tickets[0].boarded = true
            const bbb = mockBBBWithRoutes([route])
            const cmd = new CancelCommand(bbb)

            //act
            cmd.execute(['T_R1_9'])

            //assert
            expect(this.spy.mock.calls).to.deep.equal([['Unable to cancel ticket T_R1_9: Ticket is already boarded']]);
            expect(bbb.routes.length).to.equal(1)

            const expectedRoute = cloneRouteObject(routeMadridToledoWithOneTicket)
            expectedRoute.tickets[0].boarded = true
            validateRoute(bbb.routes[0], expectedRoute)
        }),

        it('TC_CancelCommand_6: succeeds for valid ticket', () => {
            //arrange
            const bbb = mockBBBWithRoutes([cloneRouteObject(routeMadridToledoWithOneTicket)])
            const cmd = new CancelCommand(bbb)

            //act
            cmd.execute(['T_R1_9'])

            //assert
            expect(this.spy.mock.calls).to.deep.equal([['Cancelled ticket T_R1_9 on route R1 from Madrid to Toledo']]);
            expect(bbb.routes.length).to.equal(1)

            let expectedRoute = cloneRouteObject(routeMadridToledoWithOneTicket)
            expectedRoute.availableSeats.push(9)
            expectedRoute.tickets.pop()
            validateRoute(bbb.routes[0], expectedRoute)
        })


    })

})