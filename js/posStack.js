"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var pos_1 = require("pos");
var PosStack = /** @class */ (function (_super) {
    __extends(PosStack, _super);
    function PosStack() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PosStack.prototype.forEach = function (callback) {
        var p = this;
        var id = 0;
        while (p) {
            if (!callback(p, id))
                break;
            p = p.next;
            id++;
        }
    };
    PosStack.fromPos = function (pos) {
        return new PosStack(pos.x, pos.y);
    };
    return PosStack;
}(pos_1.XY));
module.exports = PosStack; module.exports.default = PosStack; exports.default = PosStack;
