"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Route_1 = require("./Route");
var RegisterRouteCommand = /** @class */ (function () {
    function RegisterRouteCommand(commandId, bbb) {
        var _this = this;
        this.execute = function (args) {
            if (args.length < 4) {
                console.log('Invalid number of arguments given');
                return;
            }
            var routeId = args[0].trim();
            if (!routeId || routeId.length === 0) {
                console.log('Invalid value for route given');
                return;
            }
            var source = args[1].trim();
            if (!source || source.length === 0) {
                console.log('Invalid value for source given');
                return;
            }
            var destination = args[2].trim();
            if (!destination || destination.length === 0) {
                console.log('Invalid value for destination given');
                return;
            }
            var capacity = Number(args[3]);
            if (capacity === NaN || capacity < 1) {
                console.log('Invalid value for capacity given');
                return;
            }
            var route = new Route_1.Route(routeId, source, destination, capacity);
            _this._bbb.routes.push(route);
            console.log("Created route " + routeId + " from " + source + " to " + destination + " with " + capacity + " seats");
        };
        if (!commandId || commandId.trim().length === 0) {
            throw new Error('Invalid commandId');
        }
        if (bbb === null) {
            throw new Error('Invalid bbb');
        }
        this._commandId = commandId;
        this._bbb = bbb;
    }
    Object.defineProperty(RegisterRouteCommand.prototype, "commandId", {
        get: function () {
            return this._commandId;
        },
        enumerable: true,
        configurable: true
    });
    return RegisterRouteCommand;
}());
exports.RegisterRouteCommand = RegisterRouteCommand;
//# sourceMappingURL=IBBBCommand.js.map