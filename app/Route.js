"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Ticket_1 = require("./Ticket");
var RouteStatus_1 = require("./RouteStatus");
var moment = require("moment");
var Route = /** @class */ (function () {
    function Route(id, source, destination, capacity) {
        var _this = this;
        this.initializeSeats = function () {
            _this._availableSeats = new Array(_this._capacity);
            for (var i = 0; i < _this._capacity; i++) {
                _this._availableSeats[i] = i;
            }
        };
        this.purchaseTicket = function () {
            if (_this._availableSeats.length === 0) {
                return {
                    success: false,
                    reason: 'No tickets available'
                };
            }
            var nextSeat = _this._availableSeats.pop();
            var ticket = new Ticket_1.Ticket("T_" + _this._id + "_" + nextSeat, nextSeat);
            _this._tickets.push(ticket);
            return {
                success: true,
                ticket: ticket
            };
        };
        this.boardTicket = function (ticketId) {
            var ticketIndex = _this._tickets.map(function (t) { return t.id; }).indexOf(ticketId);
            if (ticketIndex === -1) {
                return {
                    success: false,
                    reason: 'Ticket does not exist'
                };
            }
            var ticket = _this._tickets[ticketIndex];
            if (ticket.boarded === true) {
                return {
                    success: false,
                    reason: 'Ticket is already boarded'
                };
            }
            ticket.boarded = true;
            return {
                success: true,
                ticket: ticket
            };
        };
        this.cancelTicket = function (ticketId) {
            var ticketIndex = _this._tickets.map(function (t) { return t.id; }).indexOf(ticketId);
            if (ticketIndex === -1) {
                return {
                    success: false,
                    reason: 'Ticket does not exist'
                };
            }
            var ticket = _this._tickets[ticketIndex];
            if (ticket.boarded === true) {
                return {
                    success: false,
                    reason: 'Ticket is already boarded'
                };
            }
            var seat = ticket.seat;
            _this._tickets = _this._tickets.filter(function (t) { return t.id !== ticketId; });
            _this._availableSeats.push(seat);
            return {
                success: true,
                ticket: ticket
            };
        };
        this.depart = function () {
            _this._departed = moment();
        };
        this.hasArrived = function () {
            if (_this._departed === null) {
                return false;
            }
            var now = moment();
            if (now.isBefore(_this._departed.add(10, 'seconds'))) {
                return false;
            }
            var source = _this._source;
            _this._source = _this._destination;
            _this._destination = source;
            _this._tickets = new Array();
            _this._departed = null;
            _this.initializeSeats();
            return true;
        };
        this.toObject = function () {
            var departedString = null;
            if (_this._departed !== null) {
                departedString = _this._departed.toISOString();
            }
            var ticketObjects = _this._tickets.map(function (t) { return t.toObject(); });
            return {
                id: _this._id,
                source: _this._source,
                destination: _this._destination,
                capacity: _this._capacity,
                availableSeats: _this._availableSeats,
                tickets: ticketObjects,
                departed: departedString
            };
        };
        if (!id || id.trim().length === 0) {
            throw new Error('Invalid id');
        }
        if (!source || source.trim().length === 0) {
            throw new Error('Invalid source');
        }
        if (!destination || destination.trim().length === 0) {
            throw new Error('Invalid destination');
        }
        if (capacity < 1) {
            throw new Error('Invalid capacity');
        }
        this._id = id;
        this._source = source;
        this._destination = destination;
        this._capacity = capacity;
        this._tickets = new Array();
        this._departed = null;
        this.initializeSeats();
    }
    Object.defineProperty(Route.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Route.prototype, "source", {
        get: function () {
            return this._source;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Route.prototype, "destination", {
        get: function () {
            return this._destination;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Route.prototype, "capacity", {
        get: function () {
            return this._capacity;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Route.prototype, "tickets", {
        get: function () {
            return this._tickets;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Route.prototype, "status", {
        get: function () {
            if (this._departed !== null) {
                return RouteStatus_1.RouteStatus.travelling;
            }
            else {
                if (this._availableSeats.length === this.capacity) {
                    return RouteStatus_1.RouteStatus.empty;
                }
                else if (this._availableSeats.length === 0) {
                    return RouteStatus_1.RouteStatus.full;
                }
                else {
                    return RouteStatus_1.RouteStatus.available;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Route.fromObject = function (object) {
        if (!object.hasOwnProperty('id') ||
            !object.hasOwnProperty('source') ||
            !object.hasOwnProperty('destination') ||
            !object.hasOwnProperty('capacity') ||
            !object.hasOwnProperty('departed') ||
            !object.hasOwnProperty('availableSeats') ||
            !object.hasOwnProperty('tickets')) {
            throw new Error('Invalid object');
        }
        var route = new Route(object.id, object.source, object.destination, object.capacity);
        if (object.departed === null) {
            route._departed = null;
        }
        else {
            route._departed = moment(object.departed);
            if (!route._departed.isValid()) {
                throw new Error('Invalid departed time');
            }
        }
        route._availableSeats = object.availableSeats;
        for (var i in object.tickets) {
            var ticket = Ticket_1.Ticket.fromObject(object.tickets[i]);
            route._tickets.push(ticket);
        }
        return route;
    };
    return Route;
}());
exports.Route = Route;
//# sourceMappingURL=Route.js.map