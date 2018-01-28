import {XY} from 'pos';
export default class PosStack extends XY {
    public next: PosStack;
    public forEach(callback: (v: PosStack, id: number) => boolean): void {
        let p: PosStack = this;
        let id = 0;
        while(p) {
            if (!callback(p, id)) break;
            p = p.next;
            id ++;
        }
    }
    public static fromPos(pos: XY) {
        return new PosStack(pos.x, pos.y);
    }
}