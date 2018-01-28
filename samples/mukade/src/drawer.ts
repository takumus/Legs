import {XY} from 'pos';
export namespace line {
    type Style = (n: number) => number;
    export interface Kelp {
        pos: XY,
        radius: number
    }
    export namespace styles {
        export const normal: Style = (n: number) => n;
        export const sin: Style = (n: number) => (Math.cos(n * Math.PI + Math.PI) + 1) / 2;
        export const sinHalfB: Style = (n: number) => Math.sin(n * Math.PI / 2);
        export const sinHalfA: Style = (n: number) => Math.sin(n * Math.PI / 2 - Math.PI / 2) + 1;
    }
    export function drawMuscleLine(
        graphics: PIXI.Graphics,
        kelps: Kelp[],
        styles: Style[] | Style,
        color: number,
        resolution: number
    ) {
        for(let i = 0; i < kelps.length; i ++) {
            const fk = kelps[i];
            if (i < kelps.length - 1) {
                const tk = kelps[i + 1];
                _drawLine(
                    graphics, 
                    fk, tk, 
                    color, 
                    resolution,
                    styles[i] || styles
                );
            }
            graphics.lineStyle();
            graphics.beginFill(color);
            graphics.drawCircle(fk.pos.x, fk.pos.y, fk.radius);
            graphics.endFill();
        }
    }
    function _drawLine(
        graphics: PIXI.Graphics,
        fromKelp: Kelp,
        toKelp: Kelp,
        color: number,
        resolution: number,
        style: Style
    ) {
        const dx = toKelp.pos.x - fromKelp.pos.x;
        const dy = toKelp.pos.y - fromKelp.pos.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const vx = dx / d;
        const vy = dy / d;
        graphics.beginFill(color);
        const vxA = -vy;
        const vyA = vx;

        const dr = toKelp.radius - fromKelp.radius;
        for(let a = 0; a <= resolution; a ++) {
            const r = a / resolution;
            const rr = style(r);
            const radius = fromKelp.radius + dr * rr;
            const x = fromKelp.pos.x + dx * r + vxA * radius;
            const y = fromKelp.pos.y + dy * r + vyA * radius;
            if (a == 0) {
                graphics.moveTo(x, y);
                continue;
            }
            graphics.lineTo(x, y);
        }
        const vxB = vy;
        const vyB = -vx;
        for(let b = 0; b <= resolution; b ++) {
            const r = (1 - b / resolution);
            const rr = style(r);
            const radius = fromKelp.radius + dr * rr;
            const x = fromKelp.pos.x + dx * r + vxB * radius;
            const y = fromKelp.pos.y + dy * r + vyB * radius;
            graphics.lineTo(x, y);
        }
    }
}