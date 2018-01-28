"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MoveStyles;
(function (MoveStyles) {
    MoveStyles.normal = function (n) { return n; };
    MoveStyles.sin = function (n) { return (Math.cos(n * Math.PI + Math.PI) + 1) / 2; };
    MoveStyles.sinHalfB = function (n) { return Math.sin(n * Math.PI / 2); };
    MoveStyles.sinHalfA = function (n) { return Math.sin(n * Math.PI / 2 - Math.PI / 2) + 1; };
})(MoveStyles = exports.MoveStyles || (module.exports.MoveStyles = exports.MoveStyles = {}));
