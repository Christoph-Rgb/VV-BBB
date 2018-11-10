import {Route} from './Route'
import {IBBBCommand, RegisterRouteCommand, DeleteRouteCommand, DepartCommand} from './IBBBCommand'
import * as fs from 'fs'

const filePath = './.bbb_data'

export class BBB {

    _routes: Array<Route>
    _commands: Array<IBBBCommand>

    constructor () {
        this._commands = new Array()
        this._commands.push(new RegisterRouteCommand(this))
        this._commands.push(new DeleteRouteCommand(this))
        this._commands.push(new DepartCommand(this))

        this.loadRoutes()
        this.parseCommand()
        this.saveRoutes()
    }

    get routes(): Array<Route> {
        return this._routes
    }

    set routes(newRoutes: Array<Route>) {
        this._routes = newRoutes
    }

    private saveRoutes = () => {
        const routeObjects = this._routes.map((r) => r.toObject())
        const json = JSON.stringify(routeObjects)
    
        fs.writeFileSync(filePath, json)
    }

    private loadRoutes = () => {
        this._routes = new Array()

        if (fs.existsSync(filePath)) {
            const input = fs.readFileSync(filePath)
            const routeObjects: Array<any> = JSON.parse(input.toString())
    
            for (const index in routeObjects) {
                const route = Route.fromObject(routeObjects[index])
                route.hasArrived()

                this._routes.push(route)
            }
        }
    }

    private parseCommand = () => {
        
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
