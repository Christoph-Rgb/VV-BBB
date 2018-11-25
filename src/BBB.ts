import {Route} from './Route'
import {IBBBCommand, RegisterRouteCommand, DeleteRouteCommand, DepartCommand, StatusComamnd, BuyCommand, CheckinCommand, CancelCommand} from './IBBBCommand'
import * as fs from 'fs'

export class BBB {

    _routes: Array<Route>
    _commands: Array<IBBBCommand>
    _filePath: string

    constructor (filePath: string) {

        this._filePath = filePath

        this._commands = new Array()
        this._commands.push(new RegisterRouteCommand(this))
        this._commands.push(new DeleteRouteCommand(this))
        this._commands.push(new DepartCommand(this))
        this._commands.push(new StatusComamnd(this))
        this._commands.push(new BuyCommand(this))
        this._commands.push(new CheckinCommand(this))
        this._commands.push(new CancelCommand(this))
    }

    get routes(): Array<Route> {
        return this._routes
    }

    set routes(newRoutes: Array<Route>) {
        this._routes = newRoutes
    }

    public saveRoutes = () => {
        const routeObjects = this._routes.map((r) => r.toObject())
        const json = JSON.stringify(routeObjects)
    
        fs.writeFileSync(this._filePath, json)
    }

    public loadRoutes = () => {
        this._routes = new Array()

        if (fs.existsSync(this._filePath)) {
            const input = fs.readFileSync(this._filePath)
            const routeObjects: Array<any> = JSON.parse(input.toString())
    
            for (const index in routeObjects) {
                const route = Route.fromObject(routeObjects[index])
                route.hasArrived()

                this._routes.push(route)
            }
        }
    }

    public parseCommand = (args: Array<any>) => {
        
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

let args = process.argv
args.shift()
args.shift()

const bbb = new BBB('./.bbb_data')
bbb.loadRoutes()
bbb.parseCommand(args)
bbb.saveRoutes()
