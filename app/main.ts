// import People from "./model/People"
import Draw from "./model/Draw"
var pageIndex=0;
function main(): void {
    setPage(0)
    let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
    let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    let type: string = "pen";
    let draw = new Draw(ctx)
    let util: Array<Element> = <any>document.getElementsByClassName("util");
    let arr: Array<ImageData> = []
    util[0].addEventListener("click", (e) => {
        type = "pen"
        canvas.style.cursor = "url('./../static/img/qb.png'), pointer"
    })
    util[1].addEventListener("click", (e) => {
        type = "line"
        canvas.style.cursor = "crosshair"
    })
    util[2].addEventListener("click", (e) => {
        type = "circle"
        canvas.style.cursor = "crosshair"
    })
    util[3].addEventListener("click", (e) => {
        type = "rect"
        canvas.style.cursor = "crosshair"
    })
    util[4].addEventListener("click", (e) => {
        type = "eraser"
        canvas.style.cursor = "pointer"
    })
    util[5].addEventListener("click", (e) => {
        arr.pop()
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (arr.length > 0) {
            ctx.putImageData(arr[arr.length - 1], 0, 0, 0, 0, canvas.width, canvas.height);
        }
    })
    // window.onkeydown = (e) => {
    //     switch (e.keyCode) {
    //         case 87: people.walk("back"); break;
    //         case 83: people.walk("forward"); break;
    //         case 65: people.walk("left"); break;
    //         case 68: people.walk("right"); break;
    //     }
    // }
    canvas.onmousedown = (e) => {
        let x: number = e.offsetX;
        let y: number = e.offsetY;
        if(type=="pen"){
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
        canvas.onmousemove = (e) => {
            let x1: number = e.offsetX;
            let y1: number = e.offsetY;
            if(type!="eraser"){
                ctx.clearRect(0,0,canvas.width,canvas.height);
                if(arr.length!=0){
                    ctx.putImageData(arr[arr.length-1],0,0,0,0,canvas.width,canvas.height);
                }
            }
            draw[type](x, y, x1, y1)
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
function setPage(num:number):void{
    pageIndex+=num;
    if(pageIndex<0){
        pageIndex=0
    }
    if(pageIndex>1){
        pageIndex=1
    }
    let bg:HTMLImageElement=<HTMLImageElement>document.getElementById("bg");
    bg.src=`./../static/img/${pageIndex}.jpg`
}
main()