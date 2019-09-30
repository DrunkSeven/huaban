//一个对象
import Draw from './Draw'
export default interface EleObject {
    x: number;
    y: number;
    w: number;
    h: number;
    draw(ctx: CanvasRenderingContext2D, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number);
}