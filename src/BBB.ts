import {Ticket} from './Ticket'
import {Route} from './Route'
import {IBBBCommand, RegisterRouteCommand} from './IBBBCommand'

const filePath = './.bbb_data'

export class BBB {

    _routes: Array<Route>
    _commands: Array<IBBBCommand>

    constructor () {
        this._commands = new Array()
        this._commands.push(new RegisterRouteCommand('registerroute', this))

        this.loadRoutes()
        this.parseCommand()
        this.saveRoutes()
    }

    get routes(): Array<Route> {
        return this._routes
    }

    private saveRoutes = () => {
        const routeObjects = this._routes.map((r) => r.toObject())
        const json = JSON.stringify(routeObjects)
    
        //TODO: save json to filePath
    }

    private loadRoutes = () => {
        this._routes = new Array()
        //TODO: load routesObjects
        //for each routeObject call Routes.fromObject and push to this._routes
    }

    private parseCommand() {
        
        let args = process.argv
        args.shift()
        args.shift()

        if (args.length === 0) {
            console.log('No argument was given')
            return
        }

        const commandId = args.shift()
        const commandIndex = this._commands.map((c) => c.commandId).indexOf(commandId)
        
        if (commandIndex === -1) {
            console.log(`Command ${commandId} does not exist`)
            return
        }

        const command = this._commands[commandIndex]
        command.execute(args)
    }

}

const bbb = new BBB()


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

