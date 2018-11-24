import {Ticket} from './Ticket'
import {RouteStatus} from './RouteStatus'
import * as moment from 'moment'

export class Route {

    private _id: string
    private _source: string
    private _destination: string
    private _capacity: number
    private _departed: moment.Moment
    private _availableSeats: Array<number>
    private _tickets: Array<Ticket>

    constructor(id: string, source: string, destination: string, capacity: number) {
        if (!id || id.trim().length === 0) {
            throw new Error('Invalid id')
        }

        if (!source || source.trim().length === 0) {
            throw new Error('Invalid source')
        }

        if (!destination || destination.trim().length === 0) {
            throw new Error('Invalid destination')
        }

        if (capacity < 1) {
            throw new Error('Invalid capacity')
        }
        
        this._id = id
        this._source = source
        this._destination = destination
        this._capacity = capacity
        this._tickets = new Array()
        this._departed = null

        this.initializeSeats()
    }

    get id(): string {
        return this._id
    }

    get source(): string {
        return this._source
    }

    get destination(): string {
        return this._destination
    }

    get capacity(): number {
        return this._capacity
    }

    get tickets(): Array<Ticket> {
        return this._tickets
    }

    get status(): RouteStatus {
        if (this._departed !== null) {
            return RouteStatus.travelling
        } else {
            if (this._availableSeats.length === this.capacity) {
                return RouteStatus.empty
            } else if (this._availableSeats.length === 0) {
                return RouteStatus.full
            } else {
                return RouteStatus.available
            }
        }
    }

    private initializeSeats = () => {
        this._availableSeats = new Array(this._capacity)
        for (let i = 0; i < this._capacity; i++) {
            this._availableSeats[i] = i
        }
    }

    purchaseTicket = () => {
     
        if (this._availableSeats.length === 0) {
            return {
                success: false,
                reason: 'No tickets available'
            }
        }

        const nextSeat = this._availableSeats.pop()
        const ticket = new Ticket(`T_${this._id}_${nextSeat}`, nextSeat)
        this._tickets.push(ticket)

        return {
            success: true,
            ticket: ticket
        }
    }

    boardTicket = (ticketId: string) => {
        const ticketIndex = this._tickets.map((t) => t.id).indexOf(ticketId)

        if (ticketIndex === -1) {
            return {
                success: false,
                reason: 'Ticket does not exist'
            }
        }

        const ticket = this._tickets[ticketIndex]

        if (ticket.boarded === true) {
            return {
                success: false,
                reason: 'Ticket is already boarded'
            }
        }

        ticket.boarded = true

        return {
            success: true,
            ticket: ticket
        }
    }

    cancelTicket = (ticketId: string) => {
        const ticketIndex = this._tickets.map((t) => t.id).indexOf(ticketId)

        if (ticketIndex === -1) {
            return {
                success: false,
                reason: 'Ticket does not exist'
            }
        }

        const ticket = this._tickets[ticketIndex]

        if (ticket.boarded === true) {
            return {
                success: false,
                reason: 'Ticket is already boarded'
            }
        }

        this._tickets = this._tickets.filter((t) => t.id !== ticketId)

        return {
            success: true,
            ticket: ticket
        }
    }

    depart = () => {
        this._departed = moment()
    }

    hasArrived = () => {
        if (this._departed === null) {
            return false
        }
        
        const now = moment()
        if (now.isBefore(this._departed.add(10, 'seconds'))) {
            return false
        }

        const source = this._source
        this._source = this._destination
        this._destination = source
        this._tickets = new Array()
        this._departed = null
        this.initializeSeats()

        return true
    }

    static fromObject = (object) => {

        if (!object.hasOwnProperty('id') ||
            !object.hasOwnProperty('source') ||
            !object.hasOwnProperty('destination') ||
            !object.hasOwnProperty('capacity') ||
            !object.hasOwnProperty('departed') ||
            !object.hasOwnProperty('availableSeats') ||
            !object.hasOwnProperty('tickets')) {
            throw new Error ('Invalid object')
        }

        const route = new Route(object.id, object.source, object.destination, object.capacity)

        if (object.departed === null) {
            route._departed = null
        } else {
            route._departed = moment(object.departed)
            if (!route._departed.isValid()) {
                throw new Error ('Invalid departed time')
            }
        }

        route._availableSeats = object.availableSeats
        
        for (const i in object.tickets) {
            const ticket = Ticket.fromObject(object.tickets[i])
            route._tickets.push(ticket)
        }

        return route
    }

    toObject = () => {
        
        let departedString = null
        if (this._departed !== null) {
            departedString = this._departed.toISOString()
        }
        
        const ticketObjects = this._tickets.map((t) => t.toObject())

        return {
            id: this._id,
            source: this._source,
            destination: this._destination,
            capacity: this._capacity,
            availableSeats: this._availableSeats,
            tickets: ticketObjects,
            departed: departedString
        }

    }
}