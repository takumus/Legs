/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var main_1 = __webpack_require__(1);
	var renderer;
	var stage = new PIXI.Container();
	var canvas;
	var stageWidth = 0, stageHeight = 0;
	var main;
	var init = function () {
	    renderer = PIXI.autoDetectRenderer(800, 800, { antialias: false, resolution: window.devicePixelRatio, transparent: false });
	    canvas = document.getElementById("content");
	    canvas.appendChild(renderer.view);
	    renderer.view.style.width = "100%";
	    renderer.view.style.height = "100%";
	    window.addEventListener("resize", resize);
	    window.addEventListener('orientationchange', resize);
	    main = new main_1.default();
	    window.addEventListener('mousedown', function (e) {
	        main.mouse.x = e.clientX;
	        main.mouse.y = e.clientY;
	        main.mousePressed = true;
	        main.mousedown();
	    });
	    window.addEventListener('mouseup', function (e) {
	        main.mousePressed = false;
	        main.mouseup();
	    });
	    window.addEventListener('mousemove', function (e) {
	        main.mouse.x = e.clientX;
	        main.mouse.y = e.clientY;
	        main.mousemove();
	    });
	    window.addEventListener('touchstart', function (e) {
	        main.mouse.x = e.touches[0].clientX;
	        main.mouse.y = e.touches[0].clientY;
	        main.mousePressed = true;
	        main.mousedown();
	    });
	    window.addEventListener('touchmove', function (e) {
	        main.mouse.x = e.touches[0].clientX;
	        main.mouse.y = e.touches[0].clientY;
	        main.mousemove();
	    });
	    window.addEventListener('touchend', function (e) {
	        if (e.touches.length > 0)
	            return;
	        main.mousePressed = false;
	        main.mouseup();
	    });
	    window.addEventListener('touchcancel', function (e) {
	        if (e.touches.length > 0)
	            return;
	        main.mousePressed = false;
	        main.mouseup();
	    });
	    stage.addChild(main);
	    draw();
	    resize();
	};
	var ppos = 0;
	var draw = function () {
	    requestAnimationFrame(draw);
	    main.draw();
	    renderer.render(stage);
	};
	var resize = function () {
	    var width = canvas.offsetWidth;
	    var height = canvas.offsetHeight;
	    stageWidth = width;
	    stageHeight = height;
	    main.size.width = width;
	    main.size.height = height;
	    main.resize(width, height);
	    renderer.resize(width, height);
	};
	window["init"] = init;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

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
	var canvas_1 = __webpack_require__(2);
	var Legs = __webpack_require__(3);
	var pos_1 = __webpack_require__(6);
	var Drawer = __webpack_require__(13);
	var cubic_bezier_1 = __webpack_require__(14);
	var color_1 = __webpack_require__(16);
	var Main = /** @class */ (function (_super) {
	    __extends(Main, _super);
	    function Main() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    //private offsetGUI: dat.GUIController;
	    //private autoGUI: dat.GUIController;
	    Main.prototype.init = function () {
	        this.bodyRenderer = new MyBodyRenderer();
	        this.bodyRenderer.scale.set(0.8, 0.8);
	        this.addChild(this.bodyRenderer);
	        var props = {
	            auto: false,
	            offset: 30
	        };
	        //const d = new dat.GUI();
	        //this.autoGUI = d.add(props, "auto");
	        //this.offsetGUI = d.add(props, "offset", -60, 60);
	    };
	    Main.prototype.mousedown = function () { };
	    Main.prototype.mouseup = function () { };
	    Main.prototype.draw = function () {
	        var mx = this.mouse.x * 1 / this.bodyRenderer.scale.x;
	        var my = this.mouse.y * 1 / this.bodyRenderer.scale.x;
	        if (!this.pp) {
	            this.pp = new pos_1.XY(mx, my);
	        }
	        var vx = mx - this.pp.x;
	        var vy = my - this.pp.y;
	        this.pp.x += vx * 0.04;
	        this.pp.y += vy * 0.04;
	        var v = Math.sqrt(vx * vx + vy * vy);
	        var r = v / 500;
	        r = r > 1 ? 1 : r;
	        r = 1 - r;
	        var o = Math.floor(30);
	        //if (this.autoGUI.getValue()) {
	        //    this.offsetGUI.setValue(o);
	        //}else {
	        //    o = Number(this.offsetGUI.getValue());
	        //}
	        this.bodyRenderer.setOffset(o);
	        this.bodyRenderer.setHead(this.pp);
	    };
	    Main.prototype.resize = function (width, height) { };
	    return Main;
	}(canvas_1.default));
	exports.default = Main;
	var MyBodyRenderer = /** @class */ (function (_super) {
	    __extends(MyBodyRenderer, _super);
	    function MyBodyRenderer() {
	        var _this = _super.call(this) || this;
	        _this.body = new MyBody();
	        _this.canvas = new PIXI.Graphics();
	        _this.addChild(_this.canvas);
	        return _this;
	    }
	    MyBodyRenderer.prototype.setHead = function (o) {
	        var _this = this;
	        this.body.setHead(o);
	        this.canvas.clear();
	        var kelps = [];
	        this.canvas.lineStyle();
	        this.body.legs.forEach(function (leg, id) {
	            var color = new color_1.default(0xCCCCCC);
	            color_1.default.transformRGB(color, new color_1.default(0x999999), ((Math.cos(leg.moveProgress * Math.PI * 2) + 1) / 2));
	            Drawer.line.drawMuscleLine(_this.canvas, [
	                {
	                    pos: leg.rootPos,
	                    radius: 10
	                },
	                {
	                    pos: leg.middlePos,
	                    radius: 5
	                },
	                {
	                    pos: leg.endPos,
	                    radius: 1
	                }
	            ], [cubic_bezier_1.default(0.455, 0.03, 0.515, 0.955, 50), cubic_bezier_1.default(0.215, 0.61, 0.355, 1, 50)], color.getColor(), 5);
	        });
	        this.body.bone.forEach(function (p, id) {
	            if (id % 2 > 0)
	                return;
	            var r = (_this.body.bone.length - id) / _this.body.bone.length;
	            kelps.push({
	                pos: p,
	                radius: Math.sin(Math.PI * r) * 10 + 3,
	                ratio: 1
	            });
	        });
	        Drawer.line.drawMuscleLine(this.canvas, kelps, Drawer.line.styles.sin, 0xffffff, 5);
	    };
	    MyBodyRenderer.prototype.setOffset = function (o) {
	        this.body.setOffset(o);
	    };
	    return MyBodyRenderer;
	}(PIXI.Container));
	var MyBody = /** @class */ (function (_super) {
	    __extends(MyBody, _super);
	    function MyBody() {
	        var _this = _super.call(this, 5, 100) || this;
	        _this.legs = [];
	        var step = 60;
	        var d = 10;
	        for (var i = 14; i >= 0; i--) {
	            var offset = i * 5;
	            _this.legs.push(new Legs.NormalLeg(_this, step, offset, offset + 13, "front", Legs.Leg.Position.LEFT, 5, 40, 0 + i * d, 36, 26));
	            _this.legs.push(new Legs.NormalLeg(_this, step, offset, offset + 13, "front", Legs.Leg.Position.RIGHT, 5, 40, step / 2 + i * d, 36, 26));
	        }
	        return _this;
	    }
	    MyBody.prototype.setOffset = function (o) {
	        //this.legs[0].stepOffset = 0 + o * 2;
	        //this.legs[1].stepOffset = 60 + o * 2;
	    };
	    MyBody.prototype.move = function (moved) {
	        this.legs.forEach(function (l, id) {
	            l.moveDistance = moved;
	        });
	    };
	    return MyBody;
	}(Legs.Body));


/***/ }),
/* 2 */
/***/ (function(module, exports) {

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
	var Canvas = /** @class */ (function (_super) {
	    __extends(Canvas, _super);
	    function Canvas() {
	        var _this = _super.call(this) || this;
	        _this.mousePressed = false;
	        _this.mouse = { x: 0, y: 0 };
	        _this.size = { width: 0, height: 0 };
	        _this.canvas = new PIXI.Graphics();
	        _this.addChild(_this.canvas);
	        _this.init();
	        return _this;
	    }
	    Canvas.prototype.init = function () {
	    };
	    Canvas.prototype.draw = function () {
	    };
	    Canvas.prototype.mousedown = function () {
	    };
	    Canvas.prototype.mouseup = function () {
	    };
	    Canvas.prototype.mousemove = function () {
	    };
	    Canvas.prototype.resize = function (width, height) {
	    };
	    return Canvas;
	}(PIXI.Container));
	exports.default = Canvas;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(__webpack_require__(4));
	__export(__webpack_require__(9));
	__export(__webpack_require__(10));
	__export(__webpack_require__(5));
	__export(__webpack_require__(11));


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var posStack_1 = __webpack_require__(5);
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
	    Object.defineProperty(Body.prototype, "bone", {
	        get: function () {
	            return this._bone;
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
	        this._bone = [];
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
	                    _this._bone.push(tp.clone());
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


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

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
	var pos_1 = __webpack_require__(6);
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


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(__webpack_require__(7));
	__export(__webpack_require__(8));


/***/ }),
/* 7 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var XY = /** @class */ (function () {
	    function XY(x, y) {
	        if (x === void 0) { x = 0; }
	        if (y === void 0) { y = 0; }
	        this.x = 0;
	        this.y = 0;
	        this.x = x;
	        this.y = y;
	    }
	    XY.prototype.clone = function () {
	        return new XY(this.x, this.y);
	    };
	    XY.prototype.equals = function (pos, diff) {
	        if (diff === void 0) { diff = 1; }
	        var dx = pos.x - this.x;
	        var dy = pos.y - this.y;
	        return dx * dx + dy * dy < diff;
	    };
	    XY.prototype.round = function (n) {
	        n = Math.pow(10, n);
	        this.x = Math.floor(this.x * n) / n;
	        this.y = Math.floor(this.y * n) / n;
	    };
	    XY.prototype.distance = function (pos) {
	        var tx = pos.x - this.x;
	        var ty = pos.y - this.y;
	        return Math.sqrt(tx * tx + ty * ty);
	    };
	    XY.prototype.copyTo = function (pos) {
	        pos.x = this.x;
	        pos.y = this.y;
	    };
	    return XY;
	}());
	module.exports.XY = exports.XY = XY;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var XYR = /** @class */ (function () {
	    function XYR(x, y, r) {
	        if (x === void 0) { x = 0; }
	        if (y === void 0) { y = 0; }
	        if (r === void 0) { r = 0; }
	        this.x = 0;
	        this.y = 0;
	        this.r = 0;
	        this.x = x;
	        this.y = y;
	        this.r = r;
	    }
	    XYR.prototype.clone = function () {
	        return new XYR(this.x, this.y, this.r);
	    };
	    return XYR;
	}());
	module.exports.XYR = exports.XYR = XYR;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var MoveStyles;
	(function (MoveStyles) {
	    MoveStyles.normal = function (n) { return n; };
	    MoveStyles.sin = function (n) { return (Math.cos(n * Math.PI + Math.PI) + 1) / 2; };
	    MoveStyles.sinHalfB = function (n) { return Math.sin(n * Math.PI / 2); };
	    MoveStyles.sinHalfA = function (n) { return Math.sin(n * Math.PI / 2 - Math.PI / 2) + 1; };
	})(MoveStyles = exports.MoveStyles || (module.exports.MoveStyles = exports.MoveStyles = {}));


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var legMoveStyle_1 = __webpack_require__(9);
	var pos_1 = __webpack_require__(6);
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


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(__webpack_require__(12));


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

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
	var _1 = __webpack_require__(3);
	var pos_1 = __webpack_require__(6);
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


/***/ }),
/* 13 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var line;
	(function (line) {
	    var styles;
	    (function (styles) {
	        styles.normal = function (n) { return n; };
	        styles.sin = function (n) { return (Math.cos(n * Math.PI + Math.PI) + 1) / 2; };
	        styles.sinHalfB = function (n) { return Math.sin(n * Math.PI / 2); };
	        styles.sinHalfA = function (n) { return Math.sin(n * Math.PI / 2 - Math.PI / 2) + 1; };
	    })(styles = line.styles || (line.styles = {}));
	    function drawMuscleLine(graphics, kelps, styles, color, resolution) {
	        for (var i = 0; i < kelps.length; i++) {
	            var fk = kelps[i];
	            if (i < kelps.length - 1) {
	                var tk = kelps[i + 1];
	                _drawLine(graphics, fk, tk, color, resolution, styles[i] || styles);
	            }
	            graphics.lineStyle();
	            graphics.beginFill(color);
	            graphics.drawCircle(fk.pos.x, fk.pos.y, fk.radius);
	            graphics.endFill();
	        }
	    }
	    line.drawMuscleLine = drawMuscleLine;
	    function _drawLine(graphics, fromKelp, toKelp, color, resolution, style) {
	        var dx = toKelp.pos.x - fromKelp.pos.x;
	        var dy = toKelp.pos.y - fromKelp.pos.y;
	        var d = Math.sqrt(dx * dx + dy * dy);
	        var vx = dx / d;
	        var vy = dy / d;
	        graphics.beginFill(color);
	        var vxA = -vy;
	        var vyA = vx;
	        var dr = toKelp.radius - fromKelp.radius;
	        for (var a = 0; a <= resolution; a++) {
	            var r = a / resolution;
	            var rr = style(r);
	            var radius = fromKelp.radius + dr * rr;
	            var x = fromKelp.pos.x + dx * r + vxA * radius;
	            var y = fromKelp.pos.y + dy * r + vyA * radius;
	            if (a == 0) {
	                graphics.moveTo(x, y);
	                continue;
	            }
	            graphics.lineTo(x, y);
	        }
	        var vxB = vy;
	        var vyB = -vx;
	        for (var b = 0; b <= resolution; b++) {
	            var r = (1 - b / resolution);
	            var rr = style(r);
	            var radius = fromKelp.radius + dr * rr;
	            var x = fromKelp.pos.x + dx * r + vxB * radius;
	            var y = fromKelp.pos.y + dy * r + vyB * radius;
	            graphics.lineTo(x, y);
	        }
	    }
	})(line = exports.line || (exports.line = {}));


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var search_1 = __webpack_require__(15);
	function CubicBezier(p1x, p1y, p2x, p2y, res) {
	    if (res === void 0) { res = 50; }
	    var xList = [];
	    var tList = [];
	    p1y = 1 - p1y;
	    p2y = 1 - p2y;
	    for (var i = 0; i <= res; i++) {
	        var t = i / res;
	        xList.push(bezier(t, 0, p1x, p2x, 1));
	        tList.push(t);
	    }
	    return function (x) {
	        x = x < 0 ? 0 : x > 1 ? 1 : x;
	        var i = search_1.default(xList, res, x);
	        var ax = xList[i];
	        var bx = xList[i + 1];
	        var at = tList[i];
	        var bt = tList[i + 1];
	        return 1 - bezier(
	        //tを計算
	        (x - ax) / (bx - ax) * (bt - at) + at, 
	        //yを求める
	        1, p1y, p2y, 0);
	    };
	}
	module.exports = CubicBezier; module.exports.default = CubicBezier; exports.default = CubicBezier;
	// maximaで求めたらこうなったベジェ関数。
	function bezier(t, p0, p1, p2, p3) {
	    var mt = 1 - t;
	    return p3 * t * t * t + 3 * mt * p2 * t * t + 3 * mt * mt * p1 * t + mt * mt * mt * p0;
	}


/***/ }),
/* 15 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	//2分探索もどきで探索
	function search(arr, len, n) {
	    if (n == 0)
	        return 0;
	    var l = 0;
	    var r = len - 1;
	    while (l <= r) {
	        var m = ~~((l + r) * 0.5);
	        if (arr[m] < n) {
	            l = m + 1;
	        }
	        else {
	            r = m - 1;
	        }
	    }
	    return r;
	}
	module.exports = search; module.exports.default = search; exports.default = search;


/***/ }),
/* 16 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Color = /** @class */ (function () {
	    function Color(color) {
	        if (color === void 0) { color = 0; }
	        var _this = this;
	        this.getColor = function () { return _this.color; };
	        this.getR = function () { return _this.r; };
	        this.getG = function () { return _this.g; };
	        this.getB = function () { return _this.b; };
	        this.getH = function () { return _this.h; };
	        this.getS = function () { return _this.s; };
	        this.getV = function () { return _this.v; };
	        this.setColor(color);
	    }
	    Color.prototype.clone = function () {
	        return new Color(this.color);
	    };
	    Color.prototype.setColor = function (color) {
	        var r = color >> 16 & 0xff;
	        var g = color >> 8 & 0xff;
	        var b = color & 0xff;
	        this.color = color;
	        this.setRGB(r, g, b);
	        return this;
	    };
	    Color.prototype.setHSV = function (h, s, v) {
	        if (h === void 0) { h = -1; }
	        if (s === void 0) { s = -1; }
	        if (v === void 0) { v = -1; }
	        h = h < 0 ? this.h : h;
	        s = s < 0 ? this.s : s;
	        v = v < 0 ? this.v : v;
	        var r, g, b;
	        var i = Math.floor(h * 6);
	        var f = h * 6 - i;
	        var p = v * (1 - s);
	        var q = v * (1 - f * s);
	        var t = v * (1 - (1 - f) * s);
	        switch (i % 6) {
	            case 0:
	                r = v, g = t, b = p;
	                break;
	            case 1:
	                r = q, g = v, b = p;
	                break;
	            case 2:
	                r = p, g = v, b = t;
	                break;
	            case 3:
	                r = p, g = q, b = v;
	                break;
	            case 4:
	                r = t, g = p, b = v;
	                break;
	            case 5:
	                r = v, g = p, b = q;
	                break;
	        }
	        this.r = r * 255;
	        this.g = g * 255;
	        this.b = b * 255;
	        this.h = h;
	        this.s = s;
	        this.v = v;
	        this.rgbToDecimal();
	        return this;
	    };
	    Color.prototype.setRGB = function (r, g, b) {
	        if (r === void 0) { r = -1; }
	        if (g === void 0) { g = -1; }
	        if (b === void 0) { b = -1; }
	        r = r < 0 ? this.r : r;
	        g = g < 0 ? this.g : g;
	        b = b < 0 ? this.b : b;
	        this.r = r;
	        this.g = g;
	        this.b = b;
	        r /= 255, g /= 255, b /= 255;
	        var max = Math.max(r, g, b), min = Math.min(r, g, b);
	        var h;
	        var v = max;
	        var d = max - min;
	        var s = max === 0 ? 0 : d / max;
	        if (max === min) {
	            h = 0;
	        }
	        else {
	            switch (max) {
	                case r:
	                    h = (g - b) / d + (g < b ? 6 : 0);
	                    break;
	                case g:
	                    h = (b - r) / d + 2;
	                    break;
	                case b:
	                    h = (r - g) / d + 4;
	                    break;
	            }
	            h /= 6;
	        }
	        this.h = h;
	        this.s = s;
	        this.v = v;
	        this.rgbToDecimal();
	        return this;
	    };
	    Color.prototype.rgbToDecimal = function () {
	        this.color = (this.r << 16) + (this.g << 8) + (this.b);
	    };
	    Color.transformRGB = function (color, to, p) {
	        p = 1 - p;
	        var r = color.getR() - to.getR();
	        var g = color.getG() - to.getG();
	        var b = color.getB() - to.getB();
	        color.setRGB(to.getR() + r * p, to.getG() + g * p, to.getB() + b * p);
	    };
	    Color.transformHSV = function (color, to, p) {
	        p = 1 - p;
	        var h = color.getH() - to.getH();
	        var s = color.getS() - to.getS();
	        var v = color.getV() - to.getV();
	        color.setHSV(to.getH() + h * p, to.getS() + s * p, to.getV() + v * p);
	    };
	    return Color;
	}());
	module.exports = Color; module.exports.default = Color; exports.default = Color;


/***/ })
/******/ ]);