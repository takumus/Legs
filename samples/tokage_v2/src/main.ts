import Canvas from '../.src/canvas';
import * as Legs from 'legs';
import {XY} from 'pos';
import * as Drawer from './drawer';
import cb from 'cubic-bezier';
import Color from 'color';
export default class Main extends Canvas {
    private bodyRenderer: MyBodyRenderer;
    private pp: XY;
    //private offsetGUI: dat.GUIController;
    //private autoGUI: dat.GUIController;
    public init() {
        this.bodyRenderer = new MyBodyRenderer();
        this.bodyRenderer.scale.set(0.8, 0.8);
        this.addChild(this.bodyRenderer);
        const props = {
            auto: false,
            offset: 30
        }
        //const d = new dat.GUI();
        //this.autoGUI = d.add(props, "auto");
        //this.offsetGUI = d.add(props, "offset", -60, 60);
    }
    public mousedown() {}
    public mouseup() {}
    public draw() {
        const mx = this.mouse.x * 1 / this.bodyRenderer.scale.x;
        const my = this.mouse.y * 1 / this.bodyRenderer.scale.x;
        if (!this.pp) {
            this.pp = new XY(mx, my);
        }
        const vx = mx - this.pp.x;
        const vy = my - this.pp.y
        this.pp.x += vx * 0.1;
        this.pp.y += vy * 0.1;

        const v = Math.sqrt(vx * vx + vy * vy);
        let r = v / 500;
        r = r > 1 ? 1 : r;
        r = 1 - r;
        let o = Math.floor(30);
        //if (this.autoGUI.getValue()) {
        //    this.offsetGUI.setValue(o);
        //}else {
        //    o = Number(this.offsetGUI.getValue());
        //}
        this.bodyRenderer.setOffset(o);
        this.bodyRenderer.setHead(this.pp);
    }
    public resize(width: number, height: number) {}
}
class MyBodyRenderer extends PIXI.Container {
    private body: MyBody;
    private canvas: PIXI.Graphics;
    constructor() {
        super();
        this.body = new MyBody();
        this.canvas = new PIXI.Graphics();
        this.addChild(this.canvas);
    }
    public setHead(o: XY) {
        this.body.setHead(o);
        this.canvas.clear();
        const kelps = [];
        this.canvas.lineStyle();
        this.body.legs.forEach((leg: Legs.NormalLeg, id) => {
            const tr = (1 - (Math.cos(leg.moveProgress * Math.PI * 2) + 1) / 2) * 0.6 + 1;
            Drawer.line.drawMuscleLine(
                this.canvas,
                [
                    {
                        pos: leg.rootPos,
                        radius: 34,
                        ratio: 1
                    },
                    {
                        pos: leg.middlePos,
                        radius: 16 * tr,
                        ratio: 1
                    },
                    {
                        pos: leg.endPos,
                        radius: 4 * tr * 0.6,
                        ratio: 1
                    }
                ],
                [cb(0.455, 0.03, 0.515, 0.955, 50), cb(0.215, 0.61, 0.355, 1, 50)],
                0xCCCCCC + (0x111111 * Math.floor(id / 2)),
                5
            );
            ///*
            const a = (1 - leg.moveProgress) * 0.6 + 0.4;
            const color = new Color(0xff0000);
            Color.transformRGB(color, new Color(0x0000ff), leg.moveProgress);
            this.canvas.lineStyle(1, color.getColor());
            this.canvas.moveTo(leg.beginMovePos.x, leg.beginMovePos.y);
            this.canvas.lineTo(leg.endMovePos.x, leg.endMovePos.y);
            this.canvas.lineStyle(1, color.getColor());
            this.canvas.drawRect(leg.endMovePos.x - 5, leg.endMovePos.y - 5, 10, 10);
            this.canvas.lineStyle();
            //*/
        });
        this.body.bone.forEach((p, id) => {
            if (id % 2 > 0) return;
            const r = (this.body.bone.length - id) / this.body.bone.length;
            kelps.push({
                pos: p,
                radius: r * 40 * (id % 4 == 0 ? 0.8 : 1),
                ratio: 1
            });
        });
        Drawer.line.drawMuscleLine(
            this.canvas,
            kelps,
            Drawer.line.styles.sin,
            0xffffff,
            5
        );
    }
    public setOffset(o: number) {
        this.body.setOffset(o);
    }
}
class MyBody extends Legs.Body {
    public legs: Legs.NormalLeg[] = [];
    private posStack: PosStack;
    private moved: number = 0;
    constructor() {
        super(18, 38);
        const offset = 0;
        const d = 15;
        const stepDistance = 140;
        this.legs.push(new Legs.NormalLeg(this, stepDistance, offset,      offset + 10,  "front", Legs.Leg.Position.LEFT,  10, 60, 0 + d * 2,  80, 80));
        this.legs.push(new Legs.NormalLeg(this, stepDistance, offset,      offset + 10,  "front", Legs.Leg.Position.RIGHT, 10, 60, stepDistance / 2 + d * 2, 80, 80));
        this.legs.push(new Legs.NormalLeg(this, stepDistance, offset + 19, offset + 19, "back",  Legs.Leg.Position.LEFT,  10, 60, 0,          100, 110));
        this.legs.push(new Legs.NormalLeg(this, stepDistance, offset + 19, offset + 19, "back",  Legs.Leg.Position.RIGHT, 10, 60, stepDistance / 2,         100, 110));
    }
    public setOffset(o: number) {
    }
    public move(moved) {
        this.legs.forEach((l, id) => {
            l.moveDistance = moved;
        });
    }
    public setHead(pos: XY) {
        const np = PosStack.fromPos(pos);
        if (this.posStack) {
            if (np.distance(this.posStack) > 0) {
                this.moved += np.distance(this.posStack);
                np.next = this.posStack;
                this.posStack = np;
            }
        }else {
            this.posStack = np;
        }
        this.bone = [];
        let pp: PosStack = this.posStack;
        let tp: XY = this.posStack;
        const body: XY[] = [];
        for (let i = 0; i < this.jointCount; i ++) {
            let ad = 0;
            let nd = this.boneLength;
            pp.forEach((p, id) => {
                if (id == 0) return true;
                const dx = p.x - tp.x;
                const dy = p.y - tp.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                ad += d;
                if (ad > this.boneLength) {
                    tp = new PosStack(
                        tp.x + dx / d * nd,
                        tp.y + dy / d * nd
                    );
                    this.bone.push(tp.clone());
                    body.push(tp.clone());
                    nd = this.boneLength;
                    return false;
                }else {
                    pp = tp = p;
                    nd = this.boneLength - ad;
                }
                return true;
            });
        }
        if (pp.next && pp.next.next) {
            pp.next.next = null;
        }
        
        this.bone.forEach((p, id) => {
            if (id > 0) {
                const pp = this.bone[id - 1];
                const np = p;
                if (np && pp) {
                    const dx = pp.x - np.x;
                    const dy = pp.y - np.y;
                    const d = pp.distance(np);
                    const r = Math.sin(id * 0.2 + -this.cr) * 30;
                    const vy = dx / d * r;
                    const vx = -dy / d * r;
                    pp.x += vx * (id / this.jointCount);
                    pp.y += vy * (id / this.jointCount);
                }
            }
            return true;
        });
        this.cr += 0.1;
        this.move(this.moved);
    }
    private cr: number = 0;
}
class PosStack extends XY {
    public next: PosStack;
    public bx: number;
    public by: number;
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
        const ps = new PosStack(pos.x, pos.y);
        ps.bx = ps.x;
        ps.by = ps.y;
        return ps;
    }
}