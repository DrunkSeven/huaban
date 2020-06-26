export default class DrawControler {
    protected ctx: CanvasRenderingContext2D;
    private type: string;
    private fill: boolean;
    private polyLine: number;
    private angle: number;
    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx
    }
    init(obj) {
        this.ctx.strokeStyle = obj.color;
        this.ctx.fillStyle = obj.fillColor;
        this.ctx.lineWidth = obj.lineWidth;
        this.polyLine = obj.polyLine;
        if (obj.dashLine) {
            this.ctx.setLineDash([4, 3]);
        } else {
            this.ctx.setLineDash([]);
        }
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    rect(x, y, x1, y1) {
        this.ctx.beginPath();
        this.edit(x, y, x1, y1)
        // this.ctx.translate(x, y);
        // this.ctx.rotate(45 * Math.PI / 180);
        this.ctx.rect(x, y, x1 - x, y1 - y);
        this.drawEnd()
    }
    line(x, y, x1, y1) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x1, y1);
        this.ctx.stroke();
    }
    circle(x, y, x1, y1) {
        let r = Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2 * Math.PI);
        this.drawEnd()
    }
    ellipse(x, y, x1, y1) {
        this.ctx.beginPath();
        this.edit(x, y, x1, y1)
        this.ctx.ellipse(x, y, Math.abs(x - x1), Math.abs(y - y1), 0, 0, 2 * Math.PI);
        this.drawEnd()
    }
    /**
     *
     * @param x 多边形
     * @param y
     * @param x1
     * @param y1
     * @param n
     */
    poly(x, y, x1, y1) {
        let n = this.polyLine;
        let ctx = this.ctx;
        let r = Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));
        ctx.save();
        ctx.beginPath();
        this.edit(x, y, x1, y1)
        for (let i = 0; i <= n; i++) {
            let radian1 = ((2 * Math.PI) / this.polyLine) * (i + 1);
            let nx1 = r * Math.sin(radian1) + x;
            let ny1 = r * Math.cos(radian1) + y;
            ctx.lineTo(nx1, ny1);
        }
        ctx.closePath();     //闭合路径否则首位衔接处会怪怪的
        ctx.restore();
        if (this.fill) {
            this.ctx.fill();
            this.ctx.stroke();
        } else {
            this.ctx.stroke();
        }
    }
    pen(x, y, x1, y1) {
        this.ctx.save();
        this.ctx.lineCap = "round";
        this.ctx.lineTo(x1, y1);
        this.ctx.stroke();
        this.ctx.restore();

    }
    eraser(x, y, x1, y1) {
        let width = this.ctx.lineWidth;
        this.ctx.lineCap = "round";
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(x1 - width / 2, y1 - width / 2, width, width);
    }
    drawEnd() {
        if (this.fill) {
            this.ctx.fill();
            this.ctx.stroke();
        } else {
            this.ctx.stroke();
        }
    }
    edit(x, y, x1, y1) {
        if (this.type == "rect") {
            x = x + Math.abs(x1 - x) / 2;
            y = y + Math.abs(y1 - y) / 2;
        }
        let deg = Math.PI / 180
        let cosNum = Math.cos(deg * this.angle || 0);
        let sinNum = Math.sin(deg * this.angle || 0)
        this.ctx.setTransform(cosNum, sinNum, -sinNum, cosNum, x - x * cosNum + y * sinNum, y - x * sinNum - y * cosNum);
    }
    cut(x, y, x1, y1) {
        this.ctx.save();
        this.ctx.setLineDash([4, 2]);
        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        this.ctx.rect(x, y, x1 - x, y1 - y);
        this.ctx.stroke();
        this.ctx.restore();
    }
}