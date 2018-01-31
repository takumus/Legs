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
	var pos_1 = __webpack_require__(3);
	var bugs_1 = __webpack_require__(6);
	var routes_1 = __webpack_require__(17);
	var line_1 = __webpack_require__(20);
	var Main = /** @class */ (function (_super) {
	    __extends(Main, _super);
	    function Main() {
	        var _this = _super !== null && _super.apply(this, arguments) || this;
	        _this.currentSpeed = 0;
	        _this.targetSpeed = 0;
	        _this.ate = true;
	        return _this;
	    }
	    Main.prototype.init = function () {
	        this.p = 0;
	        this.head = new pos_1.XYR();
	        this.ppos = new pos_1.XY();
	        this.bug = new bugs_1.default();
	        this.bug.scale.set(0.6, 0.6);
	        this.addChild(this.bug);
	    };
	    Main.prototype.mousedown = function () {
	        this.foodIsReady = false;
	        this.food = new pos_1.XYR(this.mouse.x, this.mouse.y, 0);
	        this.ate = false;
	    };
	    Main.prototype.mouseup = function () {
	        this.foodIsReady = true;
	        this.p = 0;
	        this.currentRoute = this.getRoute(this.head, this.food.clone(), 80, 80);
	        this.fooding = true;
	    };
	    Main.prototype.draw = function () {
	        this.targetSpeed = this.fooding ? 8 : 2;
	        this.currentSpeed += (this.targetSpeed - this.currentSpeed) * 0.05;
	        if (this.size.width < 1)
	            return;
	        this.canvas.clear();
	        if (this.food && !this.foodIsReady) {
	            this.food.r = Math.atan2(this.mouse.y - this.food.y, this.mouse.x - this.food.x);
	            this.ate = false;
	        }
	        this.bug.setOffset(40);
	        if (!this.currentRoute)
	            this.currentRoute = this.getRoute(new pos_1.XYR(0, 0, 0));
	        this.p += (this.currentSpeed) / this.currentRoute.length;
	        if (this.p > 1) {
	            this.fooding = false;
	            this.ate = true;
	            this.p = this.p % 1;
	            var begin = this.currentRoute.getTailVecPos();
	            begin.r -= Math.PI;
	            this.currentRoute = this.getRoute(begin);
	        }
	        var pos = this.currentRoute.getPosByPercent(this.p);
	        this.head.x = pos.x;
	        this.head.y = pos.y;
	        this.head.r = Math.atan2(pos.y - this.ppos.y, pos.x - this.ppos.x);
	        pos.copyTo(this.ppos);
	        if (this.fooding)
	            this.renderLine(this.currentRoute, 0x333333);
	        this.bug.setHead(pos);
	        if (!this.ate)
	            this.renderFood();
	    };
	    Main.prototype.getRoute = function (from, next, br, er) {
	        if (br === void 0) { br = 120; }
	        if (er === void 0) { er = 120; }
	        if (!next)
	            next = new pos_1.XYR(Math.random() * this.size.width * 0.2 + this.size.width * 0.4, Math.random() * this.size.height * 0.2 + this.size.height * 0.4, Math.random() * Math.PI * 2);
	        console.log(next.r);
	        return line_1.effects.sinWave(routes_1.RouteGenerator.getMinimumRoute(from, next, br + Math.random() * br * 0.7, er + Math.random() * er * 0.7, 2), 16, 0.04);
	    };
	    Main.prototype.renderFood = function () {
	        if (!this.food)
	            return;
	        this.canvas.lineStyle(1, 0xffffff);
	        this.canvas.drawCircle(this.food.x, this.food.y, 10);
	        this.canvas.moveTo(this.food.x, this.food.y);
	        this.canvas.lineTo(Math.cos(this.food.r) * 60 + this.food.x, Math.sin(this.food.r) * 60 + this.food.y);
	    };
	    Main.prototype.renderLine = function (route, color, thickness, alpha) {
	        var _this = this;
	        if (thickness === void 0) { thickness = 1; }
	        if (alpha === void 0) { alpha = 1; }
	        this.canvas.endFill();
	        this.canvas.lineStyle(thickness, color, alpha);
	        route.forEach(function (p, i) {
	            if (i == 0) {
	                _this.canvas.moveTo(p.x, p.y);
	            }
	            else {
	                _this.canvas.lineTo(p.x, p.y);
	            }
	        });
	    };
	    return Main;
	}(canvas_1.default));
	exports.default = Main;


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
	__export(__webpack_require__(5));


/***/ }),
/* 4 */
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
/* 5 */
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
/* 6 */
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
	var Legs = __webpack_require__(7);
	var Drawer = __webpack_require__(14);
	var cubic_bezier_1 = __webpack_require__(15);
	var Bug = /** @class */ (function (_super) {
	    __extends(Bug, _super);
	    function Bug() {
	        var _this = _super.call(this) || this;
	        _this.bodyCubic = cubic_bezier_1.default(0.215, 0.61, 0.355, 1, 50);
	        _this.l1Cubic = cubic_bezier_1.default(0.455, 0.03, 0.515, 0.955, 50);
	        _this.l2Cubic = cubic_bezier_1.default(0.215, 0.61, 0.355, 1, 50);
	        _this.body = new MyBody();
	        _this.canvas = new PIXI.Graphics();
	        _this.addChild(_this.canvas);
	        return _this;
	    }
	    Bug.prototype.setHead = function (o) {
	        var _this = this;
	        o.x /= this.scale.x;
	        o.y /= this.scale.y;
	        this.body.setHead(o);
	        this.canvas.clear();
	        var kelps = [];
	        this.canvas.lineStyle();
	        this.body.legs.forEach(function (leg, id) {
	            var tr = (1 - (Math.cos(leg.moveProgress * Math.PI * 2) + 1) / 2) * 0.6 + 1;
	            Drawer.line.drawMuscleLine(_this.canvas, [
	                {
	                    pos: leg.rootPos,
	                    radius: 30,
	                    ratio: 1
	                },
	                {
	                    pos: leg.middlePos,
	                    radius: 16 * tr,
	                    ratio: 1
	                },
	                {
	                    pos: leg.endPos,
	                    radius: 10 * tr * 0.6,
	                    ratio: 1
	                }
	            ], [_this.l1Cubic, _this.l2Cubic], 0xCCCCCC + (0x111111 * Math.floor(id / 2)), 5);
	        });
	        this.body.bone.forEach(function (p, id) {
	            if (id < 7)
	                return;
	            if (id % 2 > 0)
	                return;
	            var r = (_this.body.bone.length - id) / _this.body.bone.length;
	            kelps.push({
	                pos: p,
	                radius: _this.bodyCubic(r) * 40 * (id % 4 == 0 ? 0.7 : 1),
	                ratio: 1
	            });
	        });
	        Drawer.line.drawMuscleLine(this.canvas, kelps, Drawer.line.styles.sin, 0xffffff, 5);
	    };
	    Bug.prototype.setOffset = function (o) {
	        this.body.setOffset(o);
	    };
	    return Bug;
	}(PIXI.Container));
	exports.default = Bug;
	var MyBody = /** @class */ (function (_super) {
	    __extends(MyBody, _super);
	    function MyBody() {
	        var _this = _super.call(this, 18, 40) || this;
	        _this.legs = [];
	        var offset = 0;
	        var d = 15;
	        _this.legs.push(new Legs.NormalLeg(_this, 180, offset, offset + 12, "front", Legs.Leg.Position.LEFT, 10, 60, 0 + d * 2, 110, 90));
	        _this.legs.push(new Legs.NormalLeg(_this, 180, offset, offset + 12, "front", Legs.Leg.Position.RIGHT, 10, 60, 60 + d * 2, 110, 90));
	        _this.legs.push(new Legs.NormalLeg(_this, 180, offset + 16, offset + 18, "back", Legs.Leg.Position.LEFT, 20, 70, 60 + d * 1, 120, 120));
	        _this.legs.push(new Legs.NormalLeg(_this, 180, offset + 16, offset + 18, "back", Legs.Leg.Position.RIGHT, 20, 70, 0 + d * 1, 120, 120));
	        _this.legs.push(new Legs.NormalLeg(_this, 180, offset + 24, offset + 24, "back", Legs.Leg.Position.LEFT, 10, 70, 0, 120, 130));
	        _this.legs.push(new Legs.NormalLeg(_this, 180, offset + 24, offset + 24, "back", Legs.Leg.Position.RIGHT, 10, 70, 60, 120, 130));
	        return _this;
	    }
	    MyBody.prototype.setOffset = function (o) {
	        this.legs[0].stepOffset = 0 + o * 2;
	        this.legs[1].stepOffset = 90 + o * 2;
	        this.legs[2].stepOffset = 90 + o * 1;
	        this.legs[3].stepOffset = 0 + o * 1;
	        this.legs[4].stepOffset = 0;
	        this.legs[5].stepOffset = 90;
	    };
	    MyBody.prototype.move = function (moved) {
	        this.legs.forEach(function (l, id) {
	            l.moveDistance = moved;
	        });
	    };
	    return MyBody;
	}(Legs.Body));


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(__webpack_require__(8));
	__export(__webpack_require__(10));
	__export(__webpack_require__(11));
	__export(__webpack_require__(9));
	__export(__webpack_require__(12));


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var posStack_1 = __webpack_require__(9);
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
/* 9 */
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
	var pos_1 = __webpack_require__(3);
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
/* 10 */
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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var legMoveStyle_1 = __webpack_require__(10);
	var pos_1 = __webpack_require__(3);
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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(__webpack_require__(13));


/***/ }),
/* 13 */
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
	var _1 = __webpack_require__(7);
	var pos_1 = __webpack_require__(3);
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
/* 14 */
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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var search_1 = __webpack_require__(16);
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
/* 16 */
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
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var circle_1 = __webpack_require__(18);
	var line_1 = __webpack_require__(20);
	var M = __webpack_require__(19);
	var pos_1 = __webpack_require__(3);
	var RouteGenerator = /** @class */ (function () {
	    function RouteGenerator() {
	    }
	    RouteGenerator.getMinimumRoute = function (vposB, vposE, rB, rE, res, debug) {
	        if (debug === void 0) { debug = false; }
	        var routes = this.getAllRoute(vposB, vposE, rB, rE, debug);
	        var min = Number.MAX_VALUE;
	        var route;
	        for (var i = 0; i < routes.length; i++) {
	            var r = routes[i];
	            if (r.getLength() < min) {
	                min = r.getLength();
	                route = r;
	            }
	        }
	        ;
	        return route.generateRoute(res);
	    };
	    RouteGenerator.getAllRoute = function (vposB, vposE, rB, rE, debug) {
	        if (debug === void 0) { debug = false; }
	        var cB1 = new circle_1.Circle(Math.cos(vposB.r + M.H_PI) * rB + vposB.x, Math.sin(vposB.r + M.H_PI) * rB + vposB.y, rB, 1, vposB.r - M.H_PI);
	        var cB2 = new circle_1.Circle(Math.cos(vposB.r - M.H_PI) * rB + vposB.x, Math.sin(vposB.r - M.H_PI) * rB + vposB.y, rB, -1, vposB.r + M.H_PI);
	        var cE1 = new circle_1.Circle(Math.cos(vposE.r + M.H_PI) * rE + vposE.x, Math.sin(vposE.r + M.H_PI) * rE + vposE.y, rE, 1, vposE.r - M.H_PI);
	        var cE2 = new circle_1.Circle(Math.cos(vposE.r - M.H_PI) * rE + vposE.x, Math.sin(vposE.r - M.H_PI) * rE + vposE.y, rE, -1, vposE.r + M.H_PI);
	        var allRoute = [];
	        var route;
	        route = this.getRoute(cB1, cE1, debug);
	        if (route)
	            allRoute.push(route);
	        route = this.getRoute(cB1, cE2, debug);
	        if (route)
	            allRoute.push(route);
	        route = this.getRoute(cB2, cE1, debug);
	        if (route)
	            allRoute.push(route);
	        route = this.getRoute(cB2, cE2, debug);
	        if (route)
	            allRoute.push(route);
	        return allRoute;
	    };
	    RouteGenerator.getRoute = function (c1, c2, _debug) {
	        var debug = _debug ? new Debug() : null;
	        var dx = c2.x - c1.x;
	        var dy = c2.y - c1.y;
	        var l = dx * dx + dy * dy;
	        var a1 = new pos_1.XY(), a2 = new pos_1.XY(), b1 = new pos_1.XY(), b2 = new pos_1.XY();
	        var br = Math.atan2(c2.y - c1.y, c2.x - c1.x);
	        var c1tr = c1.tr;
	        var c2tr = c2.tr;
	        var c1r;
	        var c2r;
	        var c1dr;
	        var c2dr;
	        //this.circle(c1.x + Math.cos(c1tr) * c1.r, c1.y + Math.sin(c1tr) * c1.r, 3);
	        //this.circle(c2.x + Math.cos(c2tr) * c2.r, c2.y + Math.sin(c2tr) * c2.r, 3);
	        if (c1.d == c2.d) {
	            var d = l - (c2.r - c1.r) * (c2.r - c1.r);
	            if (d < 0)
	                return null;
	            d = Math.sqrt(d);
	            a1.x = c1.r * ((c1.r - c2.r) * dx + d * dy) / l + c1.x;
	            a1.y = c1.r * ((c1.r - c2.r) * dy - d * dx) / l + c1.y;
	            a2.x = c1.r * ((c1.r - c2.r) * dx - d * dy) / l + c1.x;
	            a2.y = c1.r * ((c1.r - c2.r) * dy + d * dx) / l + c1.y;
	            b1.x = c2.r * ((c2.r - c1.r) * -dx - d * -dy) / l + c2.x;
	            b1.y = c2.r * ((c2.r - c1.r) * -dy + d * -dx) / l + c2.y;
	            b2.x = c2.r * ((c2.r - c1.r) * -dx + d * -dy) / l + c2.x;
	            b2.y = c2.r * ((c2.r - c1.r) * -dy - d * -dx) / l + c2.y;
	            var r = Math.atan2(a1.y - c1.y, a1.x - c1.x) - br;
	            if (c1.d > 0) {
	                c2r = c1r = M.normalize(r + br);
	                if (debug) {
	                    debug.p1 = a1;
	                    debug.p2 = b1;
	                }
	            }
	            else {
	                c2r = c1r = M.normalize(-r + br);
	                if (debug) {
	                    debug.p1 = a2;
	                    debug.p2 = b2;
	                }
	            }
	        }
	        else if (c1.d != c2.d) {
	            var d = l - (c2.r + c1.r) * (c2.r + c1.r);
	            if (d < 0)
	                return null;
	            d = Math.sqrt(d);
	            a1.x = c1.r * ((c2.r + c1.r) * dx + d * dy) / l + c1.x;
	            a1.y = c1.r * ((c2.r + c1.r) * dy - d * dx) / l + c1.y;
	            a2.x = c1.r * ((c2.r + c1.r) * dx - d * dy) / l + c1.x;
	            a2.y = c1.r * ((c2.r + c1.r) * dy + d * dx) / l + c1.y;
	            b1.x = c2.r * ((c1.r + c2.r) * -dx + d * -dy) / l + c2.x;
	            b1.y = c2.r * ((c1.r + c2.r) * -dy - d * -dx) / l + c2.y;
	            b2.x = c2.r * ((c1.r + c2.r) * -dx - d * -dy) / l + c2.x;
	            b2.y = c2.r * ((c1.r + c2.r) * -dy + d * -dx) / l + c2.y;
	            var r = Math.atan2(a1.y - c1.y, a1.x - c1.x) - br;
	            if (c1.d > 0) {
	                c1r = M.normalize(r + br);
	                c2r = M.normalize(r + br + M.PI);
	                if (debug) {
	                    debug.p1 = a1;
	                    debug.p2 = b1;
	                }
	            }
	            else {
	                c1r = M.normalize(-r + br);
	                c2r = M.normalize(-r + br + M.PI);
	                if (debug) {
	                    debug.p1 = a2;
	                    debug.p2 = b2;
	                }
	            }
	        }
	        if (c1.d > 0) {
	            if (c1.tr < c1r) {
	                c1dr = c1r - c1.tr;
	            }
	            else {
	                c1dr = M.D_PI - (c1.tr - c1r);
	            }
	        }
	        else {
	            if (c1.tr < c1r) {
	                c1dr = M.D_PI - (c1r - c1.tr);
	            }
	            else {
	                c1dr = c1.tr - c1r;
	            }
	        }
	        if (c2.d > 0) {
	            if (c2r < c2.tr) {
	                c2dr = c2.tr - c2r;
	            }
	            else {
	                c2dr = M.D_PI - (c2r - c2.tr);
	            }
	        }
	        else {
	            if (c2r < c2.tr) {
	                c2dr = M.D_PI - (c2.tr - c2r);
	            }
	            else {
	                c2dr = c2r - c2.tr;
	            }
	        }
	        if (debug) {
	            debug.circle1 = c1;
	            debug.circle2 = c2;
	        }
	        return new Route(c1, c2, c1.tr, c2r, c1dr * c1.d, c2dr * c2.d, debug);
	    };
	    RouteGenerator.getLine = function (bp, ep, res) {
	        var line = new line_1.Line();
	        var tx = ep.x - bp.x;
	        var ty = ep.y - bp.y;
	        var r = Math.atan2(ty, tx);
	        var dx = Math.cos(r) * res;
	        var dy = Math.sin(r) * res;
	        var l = Math.sqrt(tx * tx + ty * ty) - res;
	        var L = l / res;
	        for (var i = 0; i < L; i++) {
	            line.push(new pos_1.XY(dx * i + bp.x, dy * i + bp.y));
	        }
	        return line;
	    };
	    return RouteGenerator;
	}());
	module.exports.RouteGenerator = exports.RouteGenerator = RouteGenerator;
	var Debug = /** @class */ (function () {
	    function Debug() {
	        this.circle1 = new circle_1.Circle();
	        this.circle2 = new circle_1.Circle();
	        this.p1 = new pos_1.XY();
	        this.p2 = new pos_1.XY();
	    }
	    return Debug;
	}());
	module.exports.Debug = exports.Debug = Debug;
	var Route = /** @class */ (function () {
	    function Route(c1, c2, c1rb, c2rb, c1rl, c2rl, debug) {
	        if (debug === void 0) { debug = null; }
	        this.c1 = c1;
	        this.c2 = c2;
	        this.c1rb = c1rb;
	        this.c2rb = c2rb;
	        this.c1rl = c1rl;
	        this.c2rl = c2rl;
	        this.debug = debug;
	    }
	    Route.prototype.generateRoute = function (res, line) {
	        if (line === void 0) { line = new line_1.Line(); }
	        var c1rres = res / (this.c1.r * 2 * M.PI) * M.D_PI;
	        var c2rres = res / (this.c2.r * 2 * M.PI) * M.D_PI;
	        var _x = Math.cos(this.c1rb) * this.c1.r + this.c1.x;
	        var _y = Math.sin(this.c1rb) * this.c1.r + this.c1.y;
	        var tr;
	        var L = M.abs(this.c1rl);
	        for (var r = 0; r < L; r += c1rres) {
	            tr = this.c1rb + r * this.c1.d;
	            _x = Math.cos(tr) * this.c1.r + this.c1.x;
	            _y = Math.sin(tr) * this.c1.r + this.c1.y;
	            line.push(new pos_1.XY(_x, _y));
	        }
	        line.pop();
	        this.getLineRoot(new pos_1.XY(_x, _y), new pos_1.XY(Math.cos(this.c2rb) * this.c2.r + this.c2.x, Math.sin(this.c2rb) * this.c2.r + this.c2.y), res, line);
	        var LL = M.abs(this.c2rl) - c2rres;
	        for (var r = 0; r < LL; r += c2rres) {
	            tr = this.c2rb + r * this.c2.d;
	            _x = Math.cos(tr) * this.c2.r + this.c2.x;
	            _y = Math.sin(tr) * this.c2.r + this.c2.y;
	            line.push(new pos_1.XY(_x, _y));
	        }
	        line.push(new pos_1.XY(Math.cos(this.c2rb + (M.abs(this.c2rl)) * this.c2.d) * this.c2.r + this.c2.x, Math.sin(this.c2rb + (M.abs(this.c2rl)) * this.c2.d) * this.c2.r + this.c2.y));
	        return line;
	    };
	    Route.prototype.getLength = function () {
	        var l = 0;
	        l += this.c1.r * 2 * M.PI * (M.abs(this.c1rl) / (M.D_PI));
	        l += this.c2.r * 2 * M.PI * (M.abs(this.c2rl) / (M.D_PI));
	        var t1x = Math.cos(this.c1rb + this.c1rl) * this.c1.r + this.c1.x;
	        var t1y = Math.sin(this.c1rb + this.c1rl) * this.c1.r + this.c1.y;
	        var t2x = Math.cos(this.c2rb) * this.c2.r + this.c2.x;
	        var t2y = Math.sin(this.c2rb) * this.c2.r + this.c2.y;
	        var dx = t1x - t2x;
	        var dy = t1y - t2y;
	        l += Math.sqrt(dx * dx + dy * dy);
	        return l;
	    };
	    Route.prototype.getLineRoot = function (bp, ep, res, line) {
	        var tx = ep.x - bp.x;
	        var ty = ep.y - bp.y;
	        var r = Math.atan2(ty, tx);
	        var dx = Math.cos(r) * res;
	        var dy = Math.sin(r) * res;
	        var l = Math.sqrt(tx * tx + ty * ty) - res;
	        var L = l / res;
	        for (var i = 0; i < L; i++) {
	            line.push(new pos_1.XY(dx * i + bp.x, dy * i + bp.y));
	        }
	    };
	    return Route;
	}());
	module.exports.Route = exports.Route = Route;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var M = __webpack_require__(19);
	var Circle = /** @class */ (function () {
	    /**
	     * Create a point.
	     * @param x - circle's x
	     * @param y - circle's y
	     * @param r - circle's radius
	     * @param d - circle's direction
	     * @param tr - circle's target radian
	     */
	    function Circle(x, y, r, d, tr) {
	        if (x === void 0) { x = 0; }
	        if (y === void 0) { y = 0; }
	        if (r === void 0) { r = 0; }
	        if (d === void 0) { d = 0; }
	        if (tr === void 0) { tr = 0; }
	        this.x = x;
	        this.y = y;
	        this.r = r;
	        this.d = d;
	        this.tr = M.normalize(tr);
	    }
	    return Circle;
	}());
	module.exports.Circle = exports.Circle = Circle;


/***/ }),
/* 19 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	module.exports.PI = exports.PI = Math.PI;
	module.exports.H_PI = exports.H_PI = Math.PI / 2;
	module.exports.D_PI = exports.D_PI = Math.PI * 2;
	function normalize(r) {
	    r = r % exports.D_PI;
	    if (r < 0)
	        return exports.D_PI + r;
	    return r;
	}
	module.exports.normalize = exports.normalize = normalize;
	function abs(v) {
	    return v < 0 ? -v : v;
	}
	module.exports.abs = exports.abs = abs;
	function frandom(min, max) {
	    return min + (max - min) * Math.random();
	}
	module.exports.frandom = exports.frandom = frandom;
	function irandom(min, max) {
	    return Math.floor(min + (max - min + 1) * Math.random());
	}
	module.exports.irandom = exports.irandom = irandom;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(__webpack_require__(21));
	var pos_1 = __webpack_require__(3);
	var Line = /** @class */ (function () {
	    function Line(data) {
	        if (data === void 0) { data = []; }
	        this.array = [];
	        for (var i = 0; i < data.length; i++) {
	            var p = data[i];
	            this.push(new pos_1.XY(p.x, p.y));
	        }
	        this.prevPositionOffset = new pos_1.XY();
	        this.prevScaleOffset = new pos_1.XY();
	    }
	    Line.prototype.push = function (pos) {
	        this.array.push(pos);
	    };
	    Line.prototype.shift = function () {
	        return this.array.shift();
	    };
	    Line.prototype.pop = function () {
	        return this.array.pop();
	    };
	    Line.prototype.get = function (index) {
	        return this.array[index];
	    };
	    Line.prototype.forEach = function (callbackfn, thisArg) {
	        this.array.forEach(callbackfn, thisArg);
	    };
	    Object.defineProperty(Line.prototype, "length", {
	        get: function () {
	            return this.array.length;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Line.prototype.setPositionOffset = function (pos) {
	        var _this = this;
	        this.array.forEach(function (p) {
	            p.x += pos.x - _this.prevPositionOffset.x;
	            p.y += pos.y - _this.prevPositionOffset.y;
	        });
	        this.prevPositionOffset = pos.clone();
	    };
	    Line.prototype.setScaleOffset = function (scale) {
	        var _this = this;
	        this.array.forEach(function (p) {
	            p.x /= _this.prevScaleOffset.x;
	            p.y /= _this.prevScaleOffset.y;
	            p.x *= scale.x;
	            p.y *= scale.y;
	        });
	        this.prevScaleOffset = scale.clone();
	    };
	    Line.prototype.getRect = function () {
	        var minX = Number.MAX_VALUE;
	        var maxX = Number.MIN_VALUE;
	        var minY = Number.MAX_VALUE;
	        var maxY = Number.MIN_VALUE;
	        for (var i = 0; i < this.length; i++) {
	            var p = this.get(i);
	            if (minX > p.x)
	                minX = p.x;
	            else if (maxX < p.x)
	                maxX = p.x;
	            if (minY > p.y)
	                minY = p.y;
	            else if (maxY < p.y)
	                maxY = p.y;
	        }
	        return new pos_1.XY(maxX - minX, maxY - minY);
	    };
	    Line.prototype.getHeadVecPos = function () {
	        return this._getVecPos(this.get(0), this.get(1));
	    };
	    Line.prototype.getTailVecPos = function () {
	        return this._getVecPos(this.get(this.length - 1), this.get(this.length - 2));
	    };
	    Line.prototype.pushLine = function (line) {
	        var _this = this;
	        if (line.length < 1)
	            return this;
	        line = line.clone();
	        if (this.length > 0 && line.get(0).equals(this.get(this.length - 1)))
	            line.shift();
	        line.forEach(function (p) {
	            _this.push(p.clone());
	        });
	        return this;
	    };
	    Line.prototype.clone = function () {
	        var data = new Line();
	        this.forEach(function (p) {
	            data.push(p.clone());
	        });
	        return data;
	    };
	    Line.prototype.clear = function () {
	        this.array = [];
	    };
	    Line.prototype.toString = function () {
	        return JSON.stringify(this);
	    };
	    Line.prototype._getVecPos = function (fp, sp) {
	        return new pos_1.XYR(fp.x, fp.y, Math.atan2(sp.y - fp.y, sp.x - fp.x));
	    };
	    Line.prototype.getVecPos = function (id) {
	        var p1 = this.get(id);
	        var p2 = this.get(id + 1);
	        if (!p2) {
	            p1 = this.get(id - 1);
	            p2 = this.get(id);
	        }
	        return this._getVecPos(p1, p2);
	    };
	    Line.prototype.getPosByPercent = function (p) {
	        p = p < 0 ? 0 : p > 1 ? 1 : p;
	        var index = Math.floor(p * (this.length - 1));
	        var pos = this.get(index).clone();
	        var l = 1 / (this.length - 1);
	        var per = (p - l * index) / l;
	        if (per > 0) {
	            var nPos = this.get(index + 1);
	            var dx = (nPos.x - pos.x) * per;
	            var dy = (nPos.y - pos.y) * per;
	            pos.x += dx;
	            pos.y += dy;
	        }
	        return pos;
	    };
	    return Line;
	}());
	module.exports.Line = exports.Line = Line;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var pos_1 = __webpack_require__(3);
	var effects;
	(function (effects) {
	    function sinWave(line, amp, freq, randomBegin) {
	        if (randomBegin === void 0) { randomBegin = false; }
	        var newData = [];
	        var rad = randomBegin ? Math.random() * (Math.PI * 2) : 0;
	        newData.push(line.get(0).clone());
	        for (var i = 1; i < line.length - 1; i++) {
	            var p = line.get(i);
	            var vx = line.get(i - 1).x - p.x;
	            var vy = line.get(i - 1).y - p.y;
	            var np = new pos_1.XY();
	            var all = Math.sin(i / (line.length - 1) * Math.PI);
	            // all * allで開始、終了を極端にする。(先端への影響を少なく)
	            var offset = all * Math.sin(rad) * amp;
	            var vr = Math.sqrt(vx * vx + vy * vy);
	            rad += freq;
	            np.x = p.x + -(vy / vr * offset);
	            np.y = p.y + (vx / vr * offset);
	            newData.push(np);
	        }
	        newData.push(line.get(line.length - 1).clone());
	        line.clear();
	        newData.forEach(function (pos) {
	            line.push(pos);
	        });
	        return line;
	    }
	    effects.sinWave = sinWave;
	})(effects = exports.effects || (module.exports.effects = exports.effects = {}));


/***/ })
/******/ ]);