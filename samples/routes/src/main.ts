import Canvas from '../.src/canvas';
import {XY, XYR} from 'pos';
import Bug from './bugs';
import {RouteGenerator as R} from 'routes'; 
import {Line, effects} from 'line';
export default class Main extends Canvas {
    private bug: Bug;
    private pp: XY;
    private currentRoute: Line;
    private p: number;
    private food: XYR;
    private foodIsReady: boolean;
    private ppos: XY;
    private head: XYR;
    private fooding: boolean;
    private currentSpeed: number = 0;
    private targetSpeed: number = 0;
    public init() {
        this.p = 0;
        this.head = new XYR();
        this.ppos = new XY();
        this.bug = new Bug();
        this.bug.scale.set(0.6, 0.6);
        this.addChild(this.bug);
    }
    public mousedown() {
        this.foodIsReady = false;
        this.food = new XYR(this.mouse.x, this.mouse.y, 0);
    }
    public mouseup() {
        this.foodIsReady = true;
        this.p = 0;
        this.currentRoute = this.getRoute(this.head, this.food.clone(), 80, 80);
        this.fooding = true;
    }
    public draw() {
        this.targetSpeed = this.fooding ? 8 : 2;
        this.currentSpeed += (this.targetSpeed - this.currentSpeed) * 0.05;
        if (this.size.width < 1) return;
        this.canvas.clear();
        if (this.food && !this.foodIsReady) this.food.r = Math.atan2(this.mouse.y - this.food.y, this.mouse.x - this.food.x);
        this.bug.setOffset(40);
        if (!this.currentRoute) this.currentRoute = this.getRoute(new XYR(0, 0, 0));
        this.p += (this.currentSpeed) / this.currentRoute.length;
        if (this.p > 1) {
            this.fooding = false;
            this.food = null;
            this.p = this.p % 1;
            const begin = this.currentRoute.getTailVecPos();
            begin.r -= Math.PI;
            this.currentRoute = this.getRoute(begin);
        }
        const pos = this.currentRoute.getPosByPercent(this.p);
        this.head.x = pos.x;
        this.head.y = pos.y;
        this.head.r = Math.atan2(pos.y - this.ppos.y, pos.x - this.ppos.x);
        pos.copyTo(this.ppos);
        if (this.fooding) this.renderLine(this.currentRoute, 0x333333);
        this.bug.setHead(pos);
        if (this.fooding || this.food) this.renderFood();
    }
    private getRoute(from: XYR, next?: XYR, br: number = 120, er:number = 120) {
        if (!next) next = new XYR(
            Math.random() * this.size.width * 0.2 + this.size.width * 0.4,
            Math.random() * this.size.height * 0.2 + this.size.height * 0.4,
            Math.random() * Math.PI * 2
        );
        console.log(next.r);
        return effects.sinWave(
            R.getMinimumRoute(
                from,
                next,
                br + Math.random() * br * 0.7,
                er + Math.random() * er * 0.7,
                2
            ),
            16,
            0.04
        );
    }
    private renderFood() {
        if (!this.food) return;
        this.canvas.lineStyle(1, 0xffffff);
        this.canvas.drawCircle(this.food.x, this.food.y, 10);
        this.canvas.moveTo(this.food.x, this.food.y);
        this.canvas.lineTo(
            Math.cos(this.food.r) * 60 + this.food.x,
            Math.sin(this.food.r) * 60 + this.food.y
        );
    }
    private renderLine(route: Line, color: number, thickness: number = 1, alpha: number = 1) {
        this.canvas.endFill();
        this.canvas.lineStyle(thickness, color, alpha);
        route.forEach((p, i) => {
            if (i == 0) {
                this.canvas.moveTo(p.x, p.y);
            }else {
                this.canvas.lineTo(p.x, p.y);
            }
        })
    }
}