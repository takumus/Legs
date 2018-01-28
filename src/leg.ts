import {MoveStyles, LegMoveStyle} from './legMoveStyle';
import {XY} from 'pos';
import {Body} from './body';
abstract class Leg {
    private _stepDistance: number;
    private _stepDistanceHalf: number;
    private _step: number = 0;
    private _targetDistance: number;
    private _body: Body;
    private _targetRootIndex: number;
    private _rootIndex: number;
    private _nextPos: XY;
    private _prevPos: XY;
    private _nowPos: XY;
    private _directionLR: Leg.Position;
    private _stepOffset: number;
    private _endPointDistanceFromBody: number;
    private _rootPointDistanceFromBody: number;
    private _beginMovePos: XY;
    private _endMovePos: XY;
    private _moveProgress: number;
    private _moveStyle: LegMoveStyle;
    constructor(body: Body) {
        this._nowPos = new XY(0, 0);
        this._nextPos = new XY(0, 0);
        this._prevPos = new XY(0, 0);
        this._beginMovePos = new XY(0, 0);
        this._endMovePos = new XY(0, 0);
        this.body = body;
        this.moveStyle = MoveStyles.sin;
    }
    public set moveStyle(style: LegMoveStyle) {
        this._moveStyle = style;
    }
    public set endPointDistanceFromBody(value: number) {
        this._endPointDistanceFromBody = value;
    }
    public set rootPointDistanceFromBody(value: number) {
        this._rootPointDistanceFromBody = value;
    }
    public set body(body: Body) {
        this._body = body;
    }
    public set stepDistance(value: number) {
        this._stepDistance = value;
        this._stepDistanceHalf = value / 2;
    }
    public set targetRootIndex(id: number) {
        this._targetRootIndex = Math.floor(id);
    }
    public set rootIndex(id: number) {
        this._rootIndex = Math.floor(id);
    }
    public set stepOffset(value: number) {
        this._stepOffset = Math.floor(value);
    }
    public set positionLR(value: Leg.Position) {
        this._directionLR = value;
    }
    public set moveDistance(value: number) {
        value += this._stepOffset;
        const stepRate = value % this._stepDistance;
        const halfStepRate = stepRate % this._stepDistanceHalf;
        const step = Math.floor(value / this._stepDistance);
        const diffStep = Math.abs(this._step - step);
        if (diffStep > 0) {
            this._step = step;
            const nextId = Math.floor(stepRate / this._body.jointCount) + this._targetRootIndex;
            const nextPos = this.getTargetPos(nextId, this._directionLR, this._endPointDistanceFromBody);
            if (diffStep == 1) {
                this._nextPos.copyTo(this._prevPos);
                nextPos.copyTo(this._nextPos);
            }else if (diffStep > 1) {
                this._nextPos = this.getTargetPos(nextId, this._directionLR, this._endPointDistanceFromBody);
                const prevId = nextId + Math.floor(this._stepDistance / this._body.jointCount);
                this._prevPos = this.getTargetPos(prevId, this._directionLR, this._endPointDistanceFromBody);
            }
        }
        const br = (stepRate > this._stepDistanceHalf) ? 1 : halfStepRate / this._stepDistanceHalf;
        let r = this._moveStyle(br);
        this._moveProgress = r;
        this._nowPos.x = (this._nextPos.x - this._prevPos.x) * r + this._prevPos.x;
        this._nowPos.y = (this._nextPos.y - this._prevPos.y) * r + this._prevPos.y;
        
        this._beginMovePos.x = this._prevPos.x;
        this._beginMovePos.y = this._prevPos.y;
        this._endMovePos.x = this._nextPos.x;
        this._endMovePos.y = this._nextPos.y;

        const rootPos = this._body.bone[this._rootIndex];
        const fromPos = this.getRootPos(this._rootIndex);

        if (fromPos && rootPos) this.calcLeg(fromPos, this._nowPos);
    }
    private getRootPos(baseId: number) {
        const basePos = this._body.bone[baseId];
        if (!basePos) return null;
        let pos1 = basePos;
        let pos2 = this._body.bone[baseId + 1];
        if (!pos2) {
            pos1 = this._body.bone[baseId - 1];
            pos2 = basePos;
        }
        const ddx = pos2.x - pos1.x;
        const ddy = pos2.y - pos1.y;
        const D = Math.sqrt(ddx * ddx + ddy * ddy);
        const dx = ddx / D;
        const dy = ddy / D;
        return new XY(
            basePos.x + -this._directionLR * dy * this._rootPointDistanceFromBody,
            basePos.y + this._directionLR * dx * this._rootPointDistanceFromBody
        )
    }
    public abstract calcLeg(fromPos: XY, targetPos: XY);
    public get moveProgress() {
        return this._moveProgress;
    }
    public get beginMovePos() {
        return this._beginMovePos;
    }
    public get endMovePos() {
        return this._endMovePos;
    }
    public get positionLR() {
        return this._directionLR;
    }
    private getTargetPos(id: number, d: number, length: number): XY {
        let bp = this._body.bone[id];
        let fp: XY = bp;
        let tp: XY = this._body.bone[id - 1];
        if (!tp) {
            tp = fp;
            fp = this._body.bone[id + 1];
        }
        if (!tp || !fp || !bp) return new XY(0, 0);
        const ddx = tp.x - fp.x;
        const ddy = tp.y - fp.y;
        const D = Math.sqrt(ddx * ddx + ddy * ddy);
        const dx = ddx / D;
        const dy = ddy / D;
        const vx = (d < 0) ? -dy : dy;
        const vy = (d < 0) ? dx : -dx;
        bp = bp.clone();
        bp.x += vx * length;
        bp.y += vy * length;
        return bp;
    }
}
namespace Leg {
    export enum Position{
        LEFT = 1,
        RIGHT = -1
    }
}
export {
    Leg
}