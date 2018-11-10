import { BBB } from "./BBB";
import { Route } from "./Route";
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