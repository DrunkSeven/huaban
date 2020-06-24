import { Position } from '../model/draw'
export default class DrawControler {
    ctx: CanvasRenderingContext2D;
    type: string;
    fill: boolean;
    fillColor: string;
    color: string;
    lineWidth: number;
    polyLine: number;
    position: Position;
    angle: number;
    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx
    }
}