import Canvas from '../.src/canvas';
import * as Legs from 'legs';
import {XY} from 'pos';
import * as Drawer from './drawer';
import cb from 'cubic-bezier';

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
        this.pp.x += vx * 0.04;
        this.pp.y += vy * 0.04;

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
                        radius: 24,
                        ratio: 1
                    },
                    {
                        pos: leg.middlePos,
                        radius: 10 * tr,
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
            this.canvas.lineStyle(1, 0x0000ff, a);
            this.canvas.moveTo(leg.beginMovePos.x, leg.beginMovePos.y);
            this.canvas.lineTo(leg.endMovePos.x, leg.endMovePos.y);
            this.canvas.lineStyle(1, leg.moveProgress == 1 ? 0xff0000 : 0x0000ff, leg.moveProgress == 1 ? 1 : a);
            this.canvas.drawRect(leg.endMovePos.x - 5, leg.endMovePos.y - 5, 10, 10);
            this.canvas.lineStyle();
            //*/
        });
        this.body.bone.forEach((p, id) => {
            if (id % 2 > 0) return;
            const r = (this.body.bone.length - id) / this.body.bone.length;
            kelps.push({
                pos: p,
                radius: r * 30 * (id % 4 == 0 ? 0.5 : 1),
                ratio: 1
            })
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
    constructor() {
        super(18, 30);
        const offset = 0;
        const d = 15;
        this.legs.push(new Legs.NormalLeg(this, 120, offset,      offset + 8,  "front", Legs.Leg.Position.LEFT,  10, 50, 0 + d * 2,  60, 50));
        this.legs.push(new Legs.NormalLeg(this, 120, offset,      offset + 8,  "front", Legs.Leg.Position.RIGHT, 10, 50, 60 + d * 2, 60, 50));
        this.legs.push(new Legs.NormalLeg(this, 120, offset + 12, offset + 12, "back",  Legs.Leg.Position.LEFT,  20, 70, 60 + d * 1, 70, 80));
        this.legs.push(new Legs.NormalLeg(this, 120, offset + 12, offset + 12, "back",  Legs.Leg.Position.RIGHT, 20, 70, 0 + d * 1,  70, 80));
        this.legs.push(new Legs.NormalLeg(this, 120, offset + 17, offset + 17, "back",  Legs.Leg.Position.LEFT,  10, 60, 0,          80, 90));
        this.legs.push(new Legs.NormalLeg(this, 120, offset + 17, offset + 17, "back",  Legs.Leg.Position.RIGHT, 10, 60, 60,         80, 90));
    }
    public setOffset(o: number) {
        this.legs[0].stepOffset = 0 + o * 2;
        this.legs[1].stepOffset = 60 + o * 2;
        this.legs[2].stepOffset = 60 + o * 1;
        this.legs[3].stepOffset = 0 + o * 1;
        this.legs[4].stepOffset = 0;
        this.legs[5].stepOffset = 60;
    }
    public move(moved) {
        this.legs.forEach((l) => l.moveDistance = moved);
    }
}