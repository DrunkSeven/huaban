import ElObject from './EleObject'
export default class People implements ElObject {
    speed: number;
    x: number;
    y: number;
    w: number;
    h: number;
    index = [0, 0];
    private imgString: string;
    private ctx: CanvasRenderingContext2D
    constructor(x: number, y: number, w: number, h: number, imgString?: string) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.speed = 5;
        this.imgString = imgString || "";
    }
    walk(type: string) {
        if (this.index[0] > 2) {
            this.index[0] = 0
        }
        if (type == "forward") {
            this.index = [this.index[0] + 1, 0];
            this.y + this.speed < 480 - this.h ? this.y += this.speed : "";
        } else if (type == "back") {
            this.index = [this.index[0] + 1, 3];
            this.y - this.speed > 0 ? this.y -= this.speed : "";
        } else if (type == "left") {
            this.index = [this.index[0] + 1, 1];
            this.x - this.speed > 0 ? this.x -= this.speed : "";
        } else if (type == "right") {
            this.index = [this.index[0] + 1, 2];
            this.x + this.speed < 640 - this.w ? this.x += this.speed : "";
        }
        this.draw(this.ctx, this.index[0] * this.w, this.index[1] * this.h, this.w, this.h, this.x, this.y, this.w, this.h)
    }

    draw(ctx: CanvasRenderingContext2D, sx: number = 0, sy: number = 0, sw: number = this.w, sh: number = this.h, dx: number = 0, dy: number = 0, dw: number = this.w, dh: number = this.h): void {
        let img = new Image();
        this.ctx = ctx;
        img.src = this.imgString;
        // this.ctx.clearRect(0, 0, 640, 480)
        img.onload = () => {
            ctx.save();
            ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
            ctx.restore();
        }
    }
}