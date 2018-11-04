"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Ticket = /** @class */ (function () {
    function Ticket(id, seat) {
        var _this = this;
        this.toJSON = function () {
            return JSON.stringify({
                id: _this._id,
                seat: _this._seat,
                boarded: _this._boarded
            });
        };
        if (!id || id.trim().length === 0) {
            throw new Error('Invalid id');
        }
        if (seat < 0) {
            throw new Error('Invalid seat');
        }
        this._id = id;
        this._seat = seat;
        this._boarded = false;
    }
    Object.defineProperty(Ticket.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ticket.prototype, "seat", {
        get: function () {
            return this._seat;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ticket.prototype, "boarded", {
        get: function () {
            return this._boarded;
        },
        set: function (boarded) {
            this._boarded = boarded;
        },
        enumerable: true,
        configurable: true
    });
    Ticket.fromJSON = function (json) {
        var object = JSON.parse(json);
        if (!object.hasOwnProperty('id') ||
            !object.hasOwnProperty('seat') ||
            !object.hasOwnProperty('boarded')) {
            throw new Error('Invalid json');
        }
        var ticket = new Ticket(object.id, object.seat);
        ticket.boarded = object.boarded;
        return ticket;
    };
    return Ticket;
}());
exports.Ticket = Ticket;
//# sourceMappingURL=Ticket.js.map