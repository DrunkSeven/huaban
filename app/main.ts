// import People from "./model/People"
import Draw from "./model/Draw"
var pageIndex = 0;
function main(): void {
    setPage(0)
    let colorDom: HTMLCollectionOf<Element> = document.getElementsByClassName("color");
    let selectColorDom: HTMLSpanElement = <HTMLSpanElement>document.getElementById("selectColor");
    let lineWidth: HTMLInputElement = <HTMLInputElement>document.getElementById("lineWidth");
    let polyLineDom: HTMLInputElement = <HTMLInputElement>document.getElementById("polyLine");
    let util: HTMLDivElement = <HTMLDivElement>document.querySelector(".util-box");
    let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
    let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    let draw = new Draw(ctx)
    let type: string = "pen";
    let arr: Array<ImageData> = [];
    let polyLine: number = parseInt(polyLineDom.value);
    Array.from(colorDom).forEach(e => {
        let d = e as HTMLElement
        d.style.background = d.dataset.color;
        d.addEventListener("click", e => {
            draw.color = d.dataset.color;
            selectColorDom.style.background = draw.color
        })
    })
    lineWidth.addEventListener("change", e => {
        const target = e.target as HTMLInputElement;
        draw.lineWidth = parseInt(target.value)
        document.getElementById("lineWidthValue").innerText = target.value
    })
    polyLineDom.addEventListener("change", (e) => {
        const target = e.target as HTMLInputElement;
        let num = parseInt(target.value)
        type = "poly"
        if (num > 2 && num < 10) {
            polyLine = num
        } else {
            target.value = polyLine.toString()
        }

    })
    util.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        if (!target.dataset.type) {
            return
        }
        type = target.dataset.type;
        if (type == 'cancel') {
            arr.pop()
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (arr.length > 0) {
                ctx.putImageData(arr[arr.length - 1], 0, 0, 0, 0, canvas.width, canvas.height);
            }
        }
    })
    canvas.onmousedown = (e) => {
        let x: number = e.offsetX;
        let y: number = e.offsetY;
        if (type == "pen") {
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
        canvas.onmousemove = (e) => {
            let x1: number = e.offsetX;
            let y1: number = e.offsetY;
            if (type != "eraser") {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (arr.length != 0) {
                    ctx.putImageData(arr[arr.length - 1], 0, 0, 0, 0, canvas.width, canvas.height);
                }
            }
            if (type == "poly") {
                draw[type](x, y, x1, y1, polyLine)
            } else {
                draw[type](x, y, x1, y1)
            }
        }
        document.onmouseup = (e) => {
            canvas.onmousemove = null;
            document.onmouseup = null;
            if (arr.length == 100) {
                arr.shift()
            }
            ctx.save()
            arr.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        }
    }
}
function setPage(num: number): void {
    pageIndex += num;
    if (pageIndex < 0) {
        pageIndex = 0
    }
    if (pageIndex > 1) {
        pageIndex = 1
    }
    let bg: HTMLImageElement = <HTMLImageElement>document.getElementById("bg");
    bg.src = `./../static/img/${pageIndex}.jpg`
}
main()