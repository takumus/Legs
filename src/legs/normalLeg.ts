import {Leg, Body, MoveStyles} from '../';
import {XY} from 'pos';
export class NormalLeg extends Leg {
    private directionFB: number;
    public l1l: number;
    public l2l: number;
    public rootPos: XY;
    public middlePos: XY;
    public endPos: XY;
    constructor(
        body: Body, 
        stepDistance: number, 
        targetRootIndex: number, 
        rootIndex: number, 
        directionFB: string, 
        directionLR: Leg.Position,
        rootPointDistanceFromBody: number,
        endPointDistanceFromBody: number,
        stepOffset: number,
        l1l: number,
        l2l: number
    ) {
        super(body);
        this.positionLR = directionLR;
        this.setDirectionFB(directionFB);
        this.stepDistance = stepDistance;
        this.endPointDistanceFromBody = endPointDistanceFromBody;
        this.rootPointDistanceFromBody = rootPointDistanceFromBody;
        this.targetRootIndex = targetRootIndex;
        this.stepOffset = stepOffset;
        this.rootIndex = rootIndex;
        this.setL1L(l1l);
        this.setL2L(l2l);
        this.moveStyle = (n) => Math.pow(MoveStyles.sin(n), 1.7);
        this.rootPos = new XY(0, 0);
        this.middlePos = new XY(0, 0);
        this.endPos = new XY(0, 0);
    }
    public setL1L(value: number) {
        this.l1l = value;
    }
    public setL2L(value: number) {
        this.l2l = value;
    }
    public setDirectionFB(value: string) {
        this.directionFB = Math.floor(value=="front"?1:-1);
    }
    public calcLeg(fromPos: XY, targetPos: XY) {
        const poses = this.getLegPos(
            fromPos,
            targetPos,
            this.l1l, this.l2l,
            this.directionFB,
            this.positionLR
        );
        poses.begin.copyTo(this.rootPos);
        poses.middle.copyTo(this.middlePos);
        poses.end.copyTo(this.endPos);
    }
    private getLegPos(fromPos: XY, toPos: XY, l1: number, l2: number, fb: number, lr: number) {
        const r = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x);
        const a = fromPos.distance(toPos);
        let b = l1;
        let c = l2;
        const minA = a * 1.05;
        const bc = b + c;
        if (b + c < minA) {
            c = c / bc * minA;
            b = b / bc * minA;
        }
        const rc = Math.acos((a * a + b * b - c * c) / (2 * a * b));
        const rr = r + (fb * lr < 0 ? rc : -rc);
        const x = Math.cos(rr) * b + fromPos.x;
        const y = Math.sin(rr) * b + fromPos.y;
        return {
            begin: fromPos.clone(),
            middle: new XY(x, y),
            end: toPos.clone()
        };
    }
}