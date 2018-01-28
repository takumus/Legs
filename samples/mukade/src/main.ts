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
            const color = new Color(0xCCCCCC);
            Color.transformRGB(color, new Color(0x999999), ((Math.cos(leg.moveProgress * Math.PI * 2) + 1) / 2));
            Drawer.line.drawMuscleLine(
                this.canvas,
                [
                    {
                        pos: leg.rootPos,
                        radius: 10
                    },
                    {
                        pos: leg.middlePos,
                        radius: 5
                    },
                    {
                        pos: leg.endPos,
                        radius: 1
                    }
                ],
                [cb(0.455, 0.03, 0.515, 0.955, 50), cb(0.215, 0.61, 0.355, 1, 50)],
                color.getColor(),
                5
            );
        });
        this.body.bone.forEach((p, id) => {
            if (id % 2 > 0) return;
            const r = (this.body.bone.length - id) / this.body.bone.length;
            kelps.push({
                pos: p,
                radius: Math.sin(Math.PI * r) * 10 + 3,
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
        super(5, 100);
        const step = 60;
        const d = 10;
        for (let i = 14; i >= 0; i --) {
            const offset = i * 5;
            this.legs.push(new Legs.NormalLeg(this, step, offset, offset + 13, "front", Legs.Leg.Position.LEFT, 5, 40, 0 + i * d, 36, 26));
            this.legs.push(new Legs.NormalLeg(this, step, offset, offset + 13, "front", Legs.Leg.Position.RIGHT, 5, 40, step / 2 + i * d, 36, 26));
        }
    }
    public setOffset(o: number) {
        //this.legs[0].stepOffset = 0 + o * 2;
        //this.legs[1].stepOffset = 60 + o * 2;
    }
    public move(moved) {
        this.legs.forEach((l, id) => {
            l.moveDistance = moved;
        });
    }
}