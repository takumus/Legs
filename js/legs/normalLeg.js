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
var _1 = require("../");
var pos_1 = require("pos");
var NormalLeg = /** @class */ (function (_super) {
    __extends(NormalLeg, _super);
    function NormalLeg(body, stepDistance, targetRootIndex, rootIndex, directionFB, directionLR, rootPointDistanceFromBody, endPointDistanceFromBody, stepOffset, l1l, l2l) {
        var _this = _super.call(this, body) || this;
        _this.positionLR = directionLR;
        _this.setDirectionFB(directionFB);
        _this.stepDistance = stepDistance;
        _this.endPointDistanceFromBody = endPointDistanceFromBody;
        _this.rootPointDistanceFromBody = rootPointDistanceFromBody;
        _this.targetRootIndex = targetRootIndex;
        _this.stepOffset = stepOffset;
        _this.rootIndex = rootIndex;
        _this.setL1L(l1l);
        _this.setL2L(l2l);
        _this.moveStyle = function (n) { return Math.pow(_1.MoveStyles.sin(n), 1.7); };
        _this.rootPos = new pos_1.XY(0, 0);
        _this.middlePos = new pos_1.XY(0, 0);
        _this.endPos = new pos_1.XY(0, 0);
        return _this;
    }
    NormalLeg.prototype.setL1L = function (value) {
        this.l1l = value;
    };
    NormalLeg.prototype.setL2L = function (value) {
        this.l2l = value;
    };
    NormalLeg.prototype.setDirectionFB = function (value) {
        this.directionFB = Math.floor(value == "front" ? 1 : -1);
    };
    NormalLeg.prototype.calcLeg = function (fromPos, targetPos) {
        var poses = this.getLegPos(fromPos, targetPos, this.l1l, this.l2l, this.directionFB, this.positionLR);
        poses.begin.copyTo(this.rootPos);
        poses.middle.copyTo(this.middlePos);
        poses.end.copyTo(this.endPos);
    };
    NormalLeg.prototype.getLegPos = function (fromPos, toPos, l1, l2, fb, lr) {
        var r = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x);
        var a = fromPos.distance(toPos);
        var b = l1;
        var c = l2;
        var minA = a * 1.05;
        var bc = b + c;
        if (b + c < minA) {
            c = c / bc * minA;
            b = b / bc * minA;
        }
        var rc = Math.acos((a * a + b * b - c * c) / (2 * a * b));
        var rr = r + (fb * lr < 0 ? rc : -rc);
        var x = Math.cos(rr) * b + fromPos.x;
        var y = Math.sin(rr) * b + fromPos.y;
        return {
            begin: fromPos.clone(),
            middle: new pos_1.XY(x, y),
            end: toPos.clone()
        };
    };
    return NormalLeg;
}(_1.Leg));
module.exports.NormalLeg = exports.NormalLeg = NormalLeg;
