import Draw from './Draw'
export default class PlaybackWBControler extends Draw {
    t: NodeJS.Timeout
    private canvas: HTMLCanvasElement
    private _tempList: Array<any>
    constructor(canvas: HTMLCanvasElement) {
        let ctx = canvas.getContext('2d')
        super(ctx);
        this.canvas = canvas;
        this._tempList = []
    }
    set tempList(v: Array<any>) {
        v.forEach(e => {
            this._tempList.push(e)
        })
        this.reDraw()
    }
    get tempList(): Array<any> {
        return this._tempList;
    }
    *generatePath(path, type, offset = 1) {
        //生成器,生成鼠标或手指在画布上移动的路径,减少循环次数
        for (let i = 0; i < path.length; i += offset) {
            let x1 = path[i][0];
            let y1 = path[i][1];
            this[type](0, 0, x1, y1);
            yield i;
        }
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // this.ctxData[
        //   this.$store.state.live.pptObj.slide - 1
        // ] = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        // sendMsg && this.$emit("sendMsg", {}, "clear");
    }
    reDraw(callback = function () { }) {
        clearInterval(this.t);
        // let page = this.$store.state.live.pptObj.slide - 1;
        let obj = this.tempList[0];
        if (obj) {
            new Promise((resolve, reject) => {
                if (obj.action == "clear") {
                    this.clear();
                    resolve("clear");
                }
                let { x, y, x1, y1, angle } = obj.position;
                if (!obj.del) {
                    this.init(obj)
                    if ("peneraser".includes(obj.type) && obj.path) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(x, y);
                        let generatePath = this.generatePath(
                            obj.path,
                            obj.type,
                            // obj.type == "eraser" ? 1 : 2
                            1
                        );
                        if (this.tempList.length < 3) {
                            this.t = setInterval(() => {
                                let d = generatePath.next();
                                if (d.done) {
                                    clearInterval(this.t);
                                    resolve(1);
                                }
                            }, 10);
                        } else {
                            for (let i = 0; i <= obj.path.length; i++) {
                                let d = generatePath.next();
                                if (d.done) {
                                    resolve(1);
                                    break;
                                }
                            }
                        }
                    } else if (obj.type != "cancel") {
                        this[obj.type](x, y, x1, y1, angle || 0);
                        resolve(1);
                    }
                } else {
                    resolve(1);
                }
            }).then(res => {
                if (this.tempList.length == 1) {
                    callback();
                    // this.ctxData[page] = this.ctx.getImageData(
                    //     0,
                    //     0,
                    //     this.canvas.width,
                    //     this.canvas.height
                    // );
                    // if (this.playback) {
                    //     this.onmouseup();
                    // }
                }
                if (this.tempList.length) {
                    this.tempList.shift();
                    this.reDraw()
                }
            });
        } else {
            callback();
        }
    }
}