export class Ticket {

    private _id: string
    private _seat: number
    private _boarded: boolean

    constructor(id: string, seat: number) {

        if (!id || id.trim().length === 0) {
            throw new Error('Invalid id')
        }

        if (seat < 0) {
            throw new Error ('Invalid seat')
        }

        this._id = id
        this._seat = seat
        this._boarded = false
    }

    get id(): string {
        return this._id
    }

    get seat(): number {
        return this._seat
    }

    get boarded(): boolean {
        return this._boarded
    }

    set boarded(boarded: boolean) {
        this._boarded = boarded
    }

    static fromObject = (object) => {
        if (!object.hasOwnProperty('id') ||
            !object.hasOwnProperty('seat') ||
            !object.hasOwnProperty('boarded')) {
            throw new Error ('Invalid json')
        }

        let ticket = new Ticket(object.id, object.seat)
        ticket.boarded = object.boarded

        return ticket
    }

    toObject = () => {
        return {
            id: this._id,
            seat: this._seat,
            boarded: this._boarded
        }
    }

}