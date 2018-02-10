import { XY } from 'pos';
export declare class Body {
    private _boneLength;
    bone: XY[];
    private _posStack;
    private _jointCount;
    private _moved;
    constructor(boneLength: number, jointCount: number);
    readonly jointCount: number;
    readonly boneLength: number;
    setHead(pos: XY): void;
    move(move: number): void;
}
