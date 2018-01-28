import { LegMoveStyle } from './legMoveStyle';
import { XY } from 'pos';
import { Body } from './body';
declare abstract class Leg {
    private _stepDistance;
    private _stepDistanceHalf;
    private _step;
    private _targetDistance;
    private _body;
    private _targetRootIndex;
    private _rootIndex;
    private _nextPos;
    private _prevPos;
    private _nowPos;
    private _directionLR;
    private _stepOffset;
    private _endPointDistanceFromBody;
    private _rootPointDistanceFromBody;
    private _beginMovePos;
    private _endMovePos;
    private _moveProgress;
    private _moveStyle;
    constructor(body: Body);
    moveStyle: LegMoveStyle;
    endPointDistanceFromBody: number;
    rootPointDistanceFromBody: number;
    body: Body;
    stepDistance: number;
    targetRootIndex: number;
    rootIndex: number;
    stepOffset: number;
    positionLR: Leg.Position;
    moveDistance: number;
    private getRootPos(baseId);
    abstract calcLeg(fromPos: XY, targetPos: XY): any;
    readonly moveProgress: number;
    readonly beginMovePos: XY;
    readonly endMovePos: XY;
    private getTargetPos(id, d, length);
}
declare namespace Leg {
    enum Position {
        LEFT = 1,
        RIGHT = -1,
    }
}
export { Leg };
