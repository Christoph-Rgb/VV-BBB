import { BBB } from "./BBB";
import { Route } from "./Route";

export interface IBBBCommand {
    commandId: string,
    execute: (args: Array<any>) => any
}

export class RegisterRouteCommand implements IBBBCommand {

    private _commandId: string
    private _bbb: BBB

    constructor(commandId: string, bbb: BBB) {

        if (!commandId || commandId.trim().length === 0) {
            throw new Error('Invalid commandId')
        }

        if (bbb === null) {
            throw new Error('Invalid bbb')
        }

        this._commandId = commandId
        this._bbb = bbb
    }

    get commandId(): string {
        return this._commandId
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