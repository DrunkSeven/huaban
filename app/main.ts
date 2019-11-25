// import People from "./model/People"
import Draw from "./model/Draw"
var io = require('socket.io-client')
const socket = io('http://192.168.6.33:8080');

var pageIndex = 0;
let colorDom: HTMLCollectionOf<Element> = document.getElementsByClassName("color");
let selectColorDom: HTMLSpanElement = <HTMLSpanElement>document.getElementById("selectColor");
let lineWidth: HTMLInputElement = <HTMLInputElement>document.getElementById("lineWidth");
let polyLineDom: HTMLInputElement = <HTMLInputElement>document.getElementById("polyLine");
let util: HTMLDivElement = <HTMLDivElement>document.querySelector(".util-box");
let ctrlBox: HTMLDivElement = <HTMLDivElement>document.getElementById("ctrl-box");
let whiteboard: HTMLDivElement = <HTMLDivElement>document.getElementById("whiteboard");
let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
let prePage: HTMLButtonElement = <HTMLButtonElement>document.getElementById("prePage");
let nextPage: HTMLButtonElement = <HTMLButtonElement>document.getElementById("nextPage");
let preAnim: HTMLButtonElement = <HTMLButtonElement>document.getElementById("preAnim");
let nextAnim: HTMLButtonElement = <HTMLButtonElement>document.getElementById("nextAnim");
let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
let draw = new Draw(ctx)
// let arr: Array<ImageData> = [];
let pageArr: any = {};
let otherDrawObj: any = {}; //外界传进来的属性
let drawObj: any = {
    pageIndex: 0,
    animationIndex: 0,
    type: "pen",
    polyLine: parseInt(polyLineDom.value),
    color: "#000000",
    lineWidth: 1
};
let teacher = getUrlParam('teacher')
function main(): void {
    console.dir(whiteboard);
    if (!teacher) {
        ctrlBox.style.display = "none"
    }
    draw.type = drawObj.type;
    Array.from(colorDom).forEach(e => {
        let d = e as HTMLElement
        d.style.background = d.dataset.color;
        d.addEventListener("click", e => {
            drawObj.color = d.dataset.color;
            selectColorDom.style.background = drawObj.color
        })
    })
    lineWidth.addEventListener("change", e => {
        const target = e.target as HTMLInputElement;
        drawObj.lineWidth = parseInt(target.value)
        document.getElementById("lineWidthValue").innerText = target.value
    })
    polyLineDom.addEventListener("change", (e) => {
        const target = e.target as HTMLInputElement;
        let num = parseInt(target.value)
        drawObj.type = "poly"
        if (num > 2 && num < 10) {
            drawObj.polyLine = num
        } else {
            target.value = drawObj.polyLine.toString()
        }

    })
    util.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        if (!target.dataset.type) {
            return
        }
        let arr = pageArr[drawObj.pageIndex];
        console.log(arr);

        drawObj.type = target.dataset.type;
        if (drawObj.type == 'cancel') {
            arr.pop()
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (arr.length > 0) {
                ctx.putImageData(arr[arr.length - 1], 0, 0, 0, 0, canvas.width, canvas.height);
            }
        }
    })
    if (teacher) {
        canvas.onmousedown = (e) => {
            let x: number = e.offsetX;
            let y: number = e.offsetY;
            onmousedown(x, y, true)
            canvas.onmousemove = (e) => {
                let x1: number = e.offsetX;
                let y1: number = e.offsetY;
                onmousemove(x, y, x1, y1, true)
            }
            document.onmouseup = (e) => {
                onmouseup(true)
            }
        }
    }
    setTimeout(() => {
        canvas.width = whiteboard.offsetWidth;
        canvas.height = whiteboard.offsetHeight;
    }, 100);

    socket.on('draw', function (diff) {
        console.log(diff);
        let { action, data: { x, y, x1, y1 }, color, lineWidth, type } = diff;
        otherDrawObj.type = type || otherDrawObj.type;
        otherDrawObj.color = color || otherDrawObj.color;
        otherDrawObj.lineWidth = lineWidth || otherDrawObj.lineWidth;
        otherDrawObj.polyLine = diff.polyLine || otherDrawObj.polyLine;
        switch (action) {
            case "onmousedown": onmousedown(x, y); break;
            case "onmousemove": onmousemove(x, y, x1, y1); break;
            case "onmouseup": onmouseup(); break;
        }
    });
    socket.on('ppt', function (diff) {
        otherDrawObj.pageIndex = diff.data[1];
        otherDrawObj.animationIndex = diff.data[2];
        syncPPTPage()
    });
    prePage.addEventListener("click", () => {
        setPage('prePage')
    })
    nextPage.addEventListener("click", () => {
        setPage('nextPage')
    })
    // preAnim.addEventListener("click", () => {
    //     setPage('preAnim')
    // })
    // nextAnim.addEventListener("click", () => {
    //     setPage('nextAnim')
    // })
}
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); // 匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; // 返回参数值
}
function onmousedown(x, y, sendMsg?: boolean) {
    if (sendMsg) {
        draw.color = drawObj.color;
        draw.lineWidth = drawObj.lineWidth;
        draw.polyLine = drawObj.polyLine;
        draw.type = drawObj.type;
        let diff = {
            action: "onmousedown",
            type: drawObj.type,
            color: drawObj.color,
            lineWidth: drawObj.lineWidth,
            polyLine: drawObj.polyLine,
            data: {
                x: x,
                y: y
            }
        }
        socket.emit('draw', diff);
    } else {
        draw.color = otherDrawObj.color
        draw.lineWidth = otherDrawObj.lineWidth
        draw.polyLine = otherDrawObj.polyLine
        draw.type = otherDrawObj.type
    }
    if (draw.type == "pen") {
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
}
function onmousemove(x, y, x1, y1, sendMsg?: boolean) {
    if (!pageArr[drawObj.pageIndex]) {
        pageArr[drawObj.pageIndex] = []
    }
    let arr = pageArr[drawObj.pageIndex];
    console.log(arr);

    if (draw.type != "eraser") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (arr.length != 0) {
            ctx.putImageData(arr[arr.length - 1], 0, 0, 0, 0, canvas.width, canvas.height);
        }
    }
    draw[draw.type](x, y, x1, y1)
    if (sendMsg) {
        let diff = {
            action: "onmousemove",
            data: {
                x: x,
                y: y,
                x1: x1,
                y1: y1
            }
        }
        socket.emit('draw', diff);
    }
}
function onmouseup(sendMsg?: boolean) {
    let arr = pageArr[drawObj.pageIndex];
    canvas.onmousemove = null;
    document.onmouseup = null;
    ctx.save()
    arr.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (sendMsg) {
        let diff = {
            action: "onmouseup",
            data: {}
        }
        socket.emit('draw', diff);
    }
}
function syncPPTPage() {
    if (otherDrawObj.pageIndex > drawObj.pageIndex) {
        setPage('nextPage')
    } else if (otherDrawObj.pageIndex < drawObj.pageIndex) {
        setPage('prePage')
    } else {
        syncPPTAction()
        return;
    }
}
function syncPPTAction() {
    if (otherDrawObj.animationIndex && otherDrawObj.animationIndex > drawObj.animationIndex) {
        setPage('preAnim')
    } else if (otherDrawObj.animationIndex && otherDrawObj.animationIndex < drawObj.animationIndex) {
        setPage('nextAnim')
    } else {
        return;
    }
}
function setPage(type: any): void {
    let ppt: HTMLIFrameElement = <HTMLIFrameElement>document.getElementById('ppt');
    if (Number.isInteger(type)) {
        ppt.contentWindow.postMessage("goPage," + type, "*");
    } else {
        ppt.contentWindow.postMessage(type, "*");
    }
}
main()
window.addEventListener(
    "message",
    event => {
        console.log(event);
        if (event.data && event.data[0] == "pptAction") {
            if (drawObj.pageIndex != event.data[1]) {
                drawObj.pageIndex = event.data[1];

                if (!pageArr[drawObj.pageIndex]) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                } else {
                    let arr = pageArr[drawObj.pageIndex];
                    if (arr.length > 0) {
                        ctx.putImageData(arr[arr.length - 1], 0, 0, 0, 0, canvas.width, canvas.height);
                    }
                }
            }
            drawObj.animationIndex = event.data[2] || 0;
            if (teacher) {
                let diff = {
                    action: "changepage",
                    data: event.data
                }
                socket.emit('ppt', diff);
            } else if (otherDrawObj.pageIndex && otherDrawObj.pageIndex != drawObj.pageIndex) {
                syncPPTPage()
            } else if (otherDrawObj.animationIndex && otherDrawObj.animationIndex != drawObj.animationIndex) {
                syncPPTAction()
            }
        }
    },
    false
);