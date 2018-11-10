import { BBB } from "./BBB";
import { Route } from "./Route";
import { RouteStatus } from "./RouteStatus"
import { basename } from "path";

export interface IBBBCommand {
    commandId: string,
    execute: (args: Array<any>) => any
}

export abstract class BBBCommandBase {
    
    protected _bbb: BBB

    constructor(bbb: BBB) {

        if (bbb === null) {
            throw new Error('Invalid bbb')
        }

        this._bbb = bbb
    }
}

export class RegisterRouteCommand extends BBBCommandBase implements IBBBCommand {

    constructor(bbb: BBB) {
        super(bbb)
    }

    get commandId(): string {
        return 'registerroute'
    }

    execute = (args: Array<any>) => {
        if (args.length !== 4) {
            console.log('Invalid number of arguments given')
            return
        }

        const routeId = args[0].trim()
        if (!routeId || routeId.length === 0) {
            console.log('Invalid value for route given')
            return
        }

        const source = args[1].trim()
        if (!source || source.length === 0) {
            console.log('Invalid value for source given')
            return
        }

        const destination = args[2].trim()
        if (!destination || destination.length === 0) {
            console.log('Invalid value for destination given')
            return
        }

        let capacity = Number(args[3])
        if (capacity === NaN || capacity < 1) {
            console.log('Invalid value for capacity given')
            return
        }

        const route = new Route(routeId, source, destination, capacity)
        this._bbb.routes.push(route)

        console.log(`Created route ${routeId} from ${source} to ${destination} with ${capacity} seats`)
    }
}

export class DeleteRouteCommand extends BBBCommandBase implements IBBBCommand {

    constructor(bbb: BBB) {
        super(bbb)
    }

    public get commandId(): string {
        return 'deleteroute'
    }

    execute = (args: Array<any>) => {
        if (args.length !== 1) {
            console.log('Invalid number of arguments given')
            return
        }

        const routeId = args[0].trim()
        if (!routeId || routeId.length === 0) {
            console.log('Invalid value for route given')
            return
        }

        const routeIndex = this._bbb.routes.map(r => r.id).indexOf(routeId)
        if (routeIndex === -1) {
            console.log(`Route ${routeId} does not exist`)
            return
        }

        const route = this._bbb.routes[routeIndex]
        if (route.tickets.length > 0) {
            console.log(`Cannot delete route ${routeId} because there are ${route.tickets.length} tickets booked`)
            return
        }

        this._bbb.routes = this._bbb.routes.filter(r => r.id !== routeId)

        console.log(`Successfully deleted route ${routeId}`)
        return
    }
}

export class DepartCommand extends BBBCommandBase implements IBBBCommand {

    constructor(bbb: BBB) {
        super(bbb)
    }

    public get commandId(): string {
        return 'depart'
    }

    execute = (args: Array<any>) => {
        if (args.length !== 1) {
            console.log('Invalid number of arguments given')
            return
        }

        const routeId = args[0].trim()
        if (!routeId || routeId.length === 0) {
            console.log('Invalid value for route given')
            return
        }

        const routeIndex = this._bbb.routes.map(r => r.id).indexOf(routeId)
        if (routeIndex === -1) {
            console.log(`Route ${routeId} does not exist`)
            return
        }

        const route = this._bbb.routes[routeIndex]
        route.depart()

        console.log(`${routeId} departed`)
        return
    }
}

export class StatusComamnd extends BBBCommandBase implements IBBBCommand {

    constructor(bbb: BBB) {
        super(bbb)
    }

    public get commandId(): string {
        return 'status'
    }

    execute = (args: Array<any>) => {

        let routesToDisplay: Array<Route> = new Array()

        if (args.length === 0) {
            routesToDisplay = this._bbb.routes
        }
        else if (args.length === 1) 
        {
            const routeId = args[0].trim()
            if (!routeId || routeId.length === 0) {
                console.log('Invalid value for route given')
                return
            }

            const routeIndex = this._bbb.routes.map(r => r.id).indexOf(routeId)
            if (routeIndex === -1) {
                console.log(`Route ${routeId} does not exist`)
                return
            }

            const route: Route = this._bbb.routes[routeIndex]
            routesToDisplay.push(route)
        }
        else 
        {
            console.log('Invalid number of arguments given')
            return
        }

        routesToDisplay.forEach(route => console.log(`${route.id}: ${route.status}`))

        return
    }
}

export class BuyCommand extends BBBCommandBase implements IBBBCommand {

    constructor(bbb: BBB) {
        super(bbb)
    }

    public get commandId(): string {
        return 'buy'
    }

    execute = (args: Array<any>) => {
        if (args.length !== 1) {
            console.log('Invalid number of arguments given')
            return
        }

        const routeId = args[0].trim()
        if (!routeId || routeId.length === 0) {
            console.log('Invalid value for route given')
            return
        }

        const routeIndex = this._bbb.routes.map(r => r.id).indexOf(routeId)
        if (routeIndex === -1) {
            console.log(`Route ${routeId} does not exist`)
            return
        }

        const route = this._bbb.routes[routeIndex]
        const result = route.purchaseTicket()

        if (!result.success) {
            console.log('Sorry! You were too late! Tickets are sold out!')
        }

        const ticket = result.ticket

        console.log(`Successfully purchased ticket ${ticket.id} on route ${route.id} from ${route.source} to ${route.destination}`)
        return
    }
}

export class CheckinCommand extends BBBCommandBase implements IBBBCommand {

    constructor(bbb: BBB) {
        super(bbb)
    }

    public get commandId(): string {
        return 'checkin'
    }

    execute = (args: Array<any>) => {
        if (args.length !== 1) {
            console.log('Invalid number of arguments given')
            return
        }

        const ticketId = args[0].trim()
        if (!ticketId || ticketId.length === 0) {
            console.log('Invalid value for ticket given')
            return
        }


        const routes = this._bbb.routes.filter(route => route.tickets.map(ticket => ticket.id).indexOf(ticketId) !== -1)
        if (routes.length === 0) {
            console.log(`Ticket with id ${ticketId} does not exist`)
            return
        }

        const route = routes[0]
        const result = route.boardTicket(ticketId)

        if (!result.success) {
            console.log(`Unable to checkin ticket ${ticketId}: ${result.reason}`)
        }

        const ticket = result.ticket

        console.log(`Successfully checked in ticket ${ticketId} on route ${route.id} from ${route.source} to ${route.destination} and assigned seat ${ticket.seat}`)
        return
    }
}