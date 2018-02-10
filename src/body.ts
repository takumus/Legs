import {XY} from 'pos';
import PosStack from './posStack';
export class Body {
    private _boneLength: number;
    public bone: XY[];
    private _posStack: PosStack;
    private _jointCount = 60;
    private _moved: number = 0;
    constructor(boneLength: number, jointCount: number) {
        this._boneLength = boneLength;
        this._jointCount = jointCount;
    }
    public get jointCount() {
        return this._jointCount;
    }
    public get boneLength() {
        return this._boneLength;
    }
    public setHead(pos: XY) {
        const np = PosStack.fromPos(pos);
        if (this._posStack) {
            if (np.distance(this._posStack) > 0) {
                this._moved += np.distance(this._posStack);
                np.next = this._posStack;
                this._posStack = np;
            }
        }else {
            this._posStack = np;
        }
        this.bone = [];
        let pp: PosStack = this._posStack;
        let tp: XY = this._posStack;
        const body: XY[] = [];
        for (let i = 0; i < this._jointCount; i ++) {
            let ad = 0;
            let nd = this._boneLength;
            pp.forEach((p, id) => {
                if (id == 0) return true;
                const dx = p.x - tp.x;
                const dy = p.y - tp.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                ad += d;
                if (ad > this._boneLength) {
                    tp = new PosStack(
                        tp.x + dx / d * nd,
                        tp.y + dy / d * nd
                    );
                    this.bone.push(tp.clone());
                    body.push(tp.clone());
                    nd = this._boneLength;
                    return false;
                }else {
                    pp = tp = p;
                    nd = this._boneLength - ad;
                }
                return true;
            });
        }
        if (pp.next && pp.next.next) {
            pp.next.next = null;
        }
        this.move(this._moved);
    }
    public move(move: number) {
    }
}