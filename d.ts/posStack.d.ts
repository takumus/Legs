import { XY } from 'pos';
export default class PosStack extends XY {
    next: PosStack;
    forEach(callback: (v: PosStack, id: number) => boolean): void;
    static fromPos(pos: XY): PosStack;
}
