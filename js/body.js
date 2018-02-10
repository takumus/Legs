"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var posStack_1 = require("./posStack");
var Body = /** @class */ (function () {
    function Body(boneLength, jointCount) {
        this._jointCount = 60;
        this._moved = 0;
        this._boneLength = boneLength;
        this._jointCount = jointCount;
    }
    Object.defineProperty(Body.prototype, "jointCount", {
        get: function () {
            return this._jointCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Body.prototype, "boneLength", {
        get: function () {
            return this._boneLength;
        },
        enumerable: true,
        configurable: true
    });
    Body.prototype.setHead = function (pos) {
        var _this = this;
        var np = posStack_1.default.fromPos(pos);
        if (this._posStack) {
            if (np.distance(this._posStack) > 0) {
                this._moved += np.distance(this._posStack);
                np.next = this._posStack;
                this._posStack = np;
            }
        }
        else {
            this._posStack = np;
        }
        this.bone = [];
        var pp = this._posStack;
        var tp = this._posStack;
        var body = [];
        var _loop_1 = function (i) {
            var ad = 0;
            var nd = this_1._boneLength;
            pp.forEach(function (p, id) {
                if (id == 0)
                    return true;
                var dx = p.x - tp.x;
                var dy = p.y - tp.y;
                var d = Math.sqrt(dx * dx + dy * dy);
                ad += d;
                if (ad > _this._boneLength) {
                    tp = new posStack_1.default(tp.x + dx / d * nd, tp.y + dy / d * nd);
                    _this.bone.push(tp.clone());
                    body.push(tp.clone());
                    nd = _this._boneLength;
                    return false;
                }
                else {
                    pp = tp = p;
                    nd = _this._boneLength - ad;
                }
                return true;
            });
        };
        var this_1 = this;
        for (var i = 0; i < this._jointCount; i++) {
            _loop_1(i);
        }
        if (pp.next && pp.next.next) {
            pp.next.next = null;
        }
        this.move(this._moved);
    };
    Body.prototype.move = function (move) {
    };
    return Body;
}());
module.exports.Body = exports.Body = Body;
