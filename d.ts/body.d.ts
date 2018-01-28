import { XY } from 'pos';
export declare class Body {
    private _boneLength;
    private _bone;
    private _posStack;
    private _jointCount;
    private _moved;
    constructor(boneLength: number, jointCount: number);
    readonly jointCount: number;
    readonly boneLength: number;
    readonly bone: XY[];
    setHead(pos: XY): void;
    move(move: number): void;
}
