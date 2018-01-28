"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var legMoveStyle_1 = require("./legMoveStyle");
var pos_1 = require("pos");
var Leg = /** @class */ (function () {
    function Leg(body) {
        this._step = 0;
        this._nowPos = new pos_1.XY(0, 0);
        this._nextPos = new pos_1.XY(0, 0);
        this._prevPos = new pos_1.XY(0, 0);
        this._beginMovePos = new pos_1.XY(0, 0);
        this._endMovePos = new pos_1.XY(0, 0);
        this.body = body;
        this.moveStyle = legMoveStyle_1.MoveStyles.sin;
    }
    Object.defineProperty(Leg.prototype, "moveStyle", {
        set: function (style) {
            this._moveStyle = style;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Leg.prototype, "endPointDistanceFromBody", {
        set: function (value) {
            this._endPointDistanceFromBody = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Leg.prototype, "rootPointDistanceFromBody", {
        set: function (value) {
            this._rootPointDistanceFromBody = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Leg.prototype, "body", {
        set: function (body) {
            this._body = body;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Leg.prototype, "stepDistance", {
        set: function (value) {
            this._stepDistance = value;
            this._stepDistanceHalf = value / 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Leg.prototype, "targetRootIndex", {
        set: function (id) {
            this._targetRootIndex = Math.floor(id);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Leg.prototype, "rootIndex", {
        set: function (id) {
            this._rootIndex = Math.floor(id);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Leg.prototype, "stepOffset", {
        set: function (value) {
            this._stepOffset = Math.floor(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Leg.prototype, "positionLR", {
        get: function () {
            return this._directionLR;
        },
        set: function (value) {
            this._directionLR = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Leg.prototype, "moveDistance", {
        set: function (value) {
            value += this._stepOffset;
            var stepRate = value % this._stepDistance;
            var halfStepRate = stepRate % this._stepDistanceHalf;
            var step = Math.floor(value / this._stepDistance);
            var diffStep = Math.abs(this._step - step);
            if (diffStep > 0) {
                this._step = step;
                var nextId = Math.floor(stepRate / this._body.jointCount) + this._targetRootIndex;
                var nextPos = this.getTargetPos(nextId, this._directionLR, this._endPointDistanceFromBody);
                if (diffStep == 1) {
                    this._nextPos.copyTo(this._prevPos);
                    nextPos.copyTo(this._nextPos);
                }
                else if (diffStep > 1) {
                    this._nextPos = this.getTargetPos(nextId, this._directionLR, this._endPointDistanceFromBody);
                    var prevId = nextId + Math.floor(this._stepDistance / this._body.jointCount);
                    this._prevPos = this.getTargetPos(prevId, this._directionLR, this._endPointDistanceFromBody);
                }
            }
            var br = (stepRate > this._stepDistanceHalf) ? 1 : halfStepRate / this._stepDistanceHalf;
            var r = this._moveStyle(br);
            this._moveProgress = r;
            this._nowPos.x = (this._nextPos.x - this._prevPos.x) * r + this._prevPos.x;
            this._nowPos.y = (this._nextPos.y - this._prevPos.y) * r + this._prevPos.y;
            this._beginMovePos.x = this._prevPos.x;
            this._beginMovePos.y = this._prevPos.y;
            this._endMovePos.x = this._nextPos.x;
            this._endMovePos.y = this._nextPos.y;
            var rootPos = this._body.bone[this._rootIndex];
            var fromPos = this.getRootPos(this._rootIndex);
            if (fromPos && rootPos)
                this.calcLeg(fromPos, this._nowPos);
        },
        enumerable: true,
        configurable: true
    });
    Leg.prototype.getRootPos = function (baseId) {
        var basePos = this._body.bone[baseId];
        if (!basePos)
            return null;
        var pos1 = basePos;
        var pos2 = this._body.bone[baseId + 1];
        if (!pos2) {
            pos1 = this._body.bone[baseId - 1];
            pos2 = basePos;
        }
        var ddx = pos2.x - pos1.x;
        var ddy = pos2.y - pos1.y;
        var D = Math.sqrt(ddx * ddx + ddy * ddy);
        var dx = ddx / D;
        var dy = ddy / D;
        return new pos_1.XY(basePos.x + -this._directionLR * dy * this._rootPointDistanceFromBody, basePos.y + this._directionLR * dx * this._rootPointDistanceFromBody);
    };
    Object.defineProperty(Leg.prototype, "moveProgress", {
        get: function () {
            return this._moveProgress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Leg.prototype, "beginMovePos", {
        get: function () {
            return this._beginMovePos;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Leg.prototype, "endMovePos", {
        get: function () {
            return this._endMovePos;
        },
        enumerable: true,
        configurable: true
    });
    Leg.prototype.getTargetPos = function (id, d, length) {
        var bp = this._body.bone[id];
        var fp = bp;
        var tp = this._body.bone[id - 1];
        if (!tp) {
            tp = fp;
            fp = this._body.bone[id + 1];
        }
        if (!tp || !fp || !bp)
            return new pos_1.XY(0, 0);
        var ddx = tp.x - fp.x;
        var ddy = tp.y - fp.y;
        var D = Math.sqrt(ddx * ddx + ddy * ddy);
        var dx = ddx / D;
        var dy = ddy / D;
        var vx = (d < 0) ? -dy : dy;
        var vy = (d < 0) ? dx : -dx;
        bp = bp.clone();
        bp.x += vx * length;
        bp.y += vy * length;
        return bp;
    };
    return Leg;
}());
module.exports.Leg = exports.Leg = Leg;
(function (Leg) {
    var Position;
    (function (Position) {
        Position[Position["LEFT"] = 1] = "LEFT";
        Position[Position["RIGHT"] = -1] = "RIGHT";
    })(Position = Leg.Position || (Leg.Position = {}));
})(Leg || (Leg = {}));
module.exports.Leg = exports.Leg = Leg;
