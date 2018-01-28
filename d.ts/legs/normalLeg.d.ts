import { Leg, Body } from '../';
import { XY } from 'pos';
export declare class NormalLeg extends Leg {
    private directionFB;
    l1l: number;
    l2l: number;
    rootPos: XY;
    middlePos: XY;
    endPos: XY;
    constructor(body: Body, stepDistance: number, targetRootIndex: number, rootIndex: number, directionFB: string, directionLR: Leg.Position, rootPointDistanceFromBody: number, endPointDistanceFromBody: number, stepOffset: number, l1l: number, l2l: number);
    setL1L(value: number): void;
    setL2L(value: number): void;
    setDirectionFB(value: string): void;
    calcLeg(fromPos: XY, targetPos: XY): void;
    private getLegPos(fromPos, toPos, l1, l2, fb, lr);
}
