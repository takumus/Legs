export type LegMoveStyle = (n: number) => number;
export namespace MoveStyles {
    export const normal: LegMoveStyle = (n: number) => n;
    export const sin: LegMoveStyle = (n: number) => (Math.cos(n * Math.PI + Math.PI) + 1) / 2;
    export const sinHalfB: LegMoveStyle = (n: number) => Math.sin(n * Math.PI / 2);
    export const sinHalfA: LegMoveStyle = (n: number) => Math.sin(n * Math.PI / 2 - Math.PI / 2) + 1;
}