//一个对象
export default class Draw {
    private ctx: CanvasRenderingContext2D;
    private _type: string;
    private _color: string;
    private _lineWidth: number;
    constructor(ctx: CanvasRenderingContext2D, type?: string) {
        this.type = type || 'stroke'
        this.ctx = ctx;
    }
    set lineWidth(val: number) {
        this._lineWidth = val;
    }
    get lineWidth(): number {
        return this._lineWidth
    }
    set color(val: string) {
        this._color = val;
    }
    get color(): string {
        return this._color
    }
    set type(val: string) {
        this._type = val;
    }
    get type(): string {
        return this._type
    }
    init() {
        this.ctx.strokeStyle = this._color;
        this.ctx.fillStyle = this._color;
        this.ctx.lineWidth = this._lineWidth;
    }
    rect(x, y, x1, y1) {
        this.init();
        this.ctx.beginPath();
        this.ctx.rect(x, y, x1 - x, y1 - y);
        if (this._type == "stroke") {
            this.ctx.stroke();
        } else if (this._type == "fill") {
            this.ctx.fill();
        }
    }
    line(x, y, x1, y1) {
        this.init();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x1, y1);
        this.ctx.stroke();
    }
    circle(x, y, x1, y1) {
        this.init();
        var r = Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2 * Math.PI);
        if (this._type == "stroke") {
            this.ctx.stroke();
        } else if (this._type == "fill") {
            this.ctx.fill();
        }
    }
    /**
     * 
     * @param x 多边形
     * @param y 
     * @param x1 
     * @param y1 
     * @param n 
     */
    poly(x, y, x1, y1, n = 3) {
        this.init();
        var ctx = this.ctx;
        var r = Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.PI / 2);
        var nx = r * Math.cos(Math.PI / n);
        var ny = r * Math.sin(Math.PI / n);
        ctx.beginPath();
        ctx.moveTo(nx, ny);
        for (var i = 0; i <= n; i++) {
            ctx.rotate(Math.PI * 2 / n);
            ctx.lineTo(nx, -ny);
        }
        ctx.closePath();     //闭合路径否则首位衔接处会怪怪的
        if (this._type == "stroke") {
            this.ctx.stroke();
        } else if (this._type == "fill") {
            this.ctx.fill();
        }
        // 
        ctx.restore();
    }
    pen(x, y, x1, y1) {
        this.init();
        this.ctx.save();
        this.ctx.lineCap = "round";
        this.ctx.lineTo(x1, y1);
        this.ctx.stroke();
        this.ctx.restore();
    }
    eraser(x, y, x1, y1) {
        let width = 10;
        if (this._lineWidth && this._lineWidth > 10) {
            width = this._lineWidth
        }
        this.ctx.lineCap = "round";
        this.ctx.clearRect(x1 - width / 2, y1 - width / 2, width, width);
    }
    // cut(x, y, x1, y1) {
    //     this.init();
    //     this.ctx.save();
    //     this.ctx.setLineDash([4, 2]);
    //     this.ctx.beginPath();
    //     this.ctx.lineWidth = 1;
    //     this.ctx.rect(x, y, x1 - x, y1 - y);
    //     this.ctx.stroke();
    //     this.ctx.restore();
    // }
}