import * as Legs from 'legs';
import {XY} from 'pos';
import Color from 'color';
import * as Drawer from './drawer';
import cb from 'cubic-bezier';
export default class Bug extends PIXI.Container {
    private body: MyBody;
    private canvas: PIXI.Graphics;
    private bodyCubic = cb(0.215, 0.61, 0.355, 1, 50);
    private l1Cubic = cb(0.455, 0.03, 0.515, 0.955, 50);
    private l2Cubic = cb(0.215, 0.61, 0.355, 1, 50);
    constructor() {
        super();
        this.body = new MyBody();
        this.canvas = new PIXI.Graphics();
        this.addChild(this.canvas);
    }
    public setHead(o: XY) {
        o.x /= this.scale.x;
        o.y /= this.scale.y;
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
                        radius: 30,
                        ratio: 1
                    },
                    {
                        pos: leg.middlePos,
                        radius: 16 * tr,
                        ratio: 1
                    },
                    {
                        pos: leg.endPos,
                        radius: 10 * tr * 0.6,
                        ratio: 1
                    }
                ],
                [this.l1Cubic, this.l2Cubic],
                0xCCCCCC + (0x111111 * Math.floor(id / 2)),
                5
            );
        });
        this.body.bone.forEach((p, id) => {
            if (id < 7) return;
            if (id % 2 > 0) return;
            const r = (this.body.bone.length - id) / this.body.bone.length;
            kelps.push({
                pos: p,
                radius: this.bodyCubic(r) * 40 * (id % 4 == 0 ? 0.7 : 1),
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
        super(18, 40);
        const offset = 0;
        const d = 15;
        this.legs.push(new Legs.NormalLeg(this, 180, offset,      offset + 12, "front", Legs.Leg.Position.LEFT,  10, 60, 0 + d * 2,  110, 90));
        this.legs.push(new Legs.NormalLeg(this, 180, offset,      offset + 12, "front", Legs.Leg.Position.RIGHT, 10, 60, 60 + d * 2, 110, 90));
        this.legs.push(new Legs.NormalLeg(this, 180, offset + 16, offset + 18, "back",  Legs.Leg.Position.LEFT,  20, 70, 60 + d * 1, 120, 120));
        this.legs.push(new Legs.NormalLeg(this, 180, offset + 16, offset + 18, "back",  Legs.Leg.Position.RIGHT, 20, 70, 0 + d * 1,  120, 120));
        this.legs.push(new Legs.NormalLeg(this, 180, offset + 24, offset + 24, "back",  Legs.Leg.Position.LEFT,  10, 70, 0,          120, 130));
        this.legs.push(new Legs.NormalLeg(this, 180, offset + 24, offset + 24, "back",  Legs.Leg.Position.RIGHT, 10, 70, 60,         120, 130));
    }
    public setOffset(o: number) {
        this.legs[0].stepOffset = 0 + o * 2;
        this.legs[1].stepOffset = 90 + o * 2;
        this.legs[2].stepOffset = 90 + o * 1;
        this.legs[3].stepOffset = 0 + o * 1;
        this.legs[4].stepOffset = 0;
        this.legs[5].stepOffset = 90;
    }
    public move(moved) {
        this.legs.forEach((l, id) => {
            l.moveDistance = moved;
        });
    }
}