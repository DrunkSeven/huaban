const template = require("./index.html")
import './index.scss'
let WhiteBoard = {
    template: template,
    data() {
        return {
            windowSize: [],
            pptUrl: "/static/ppt/"
        }
    },
    created() {
        window.addEventListener(
            //获取iframe发来的消息
            "message",
            event => {
                let { type, value } = event.data;
                switch (type) {
                    case "pagechange": //页面变动
                        this.pageChange(value);
                        break;
                    case "stepchange": //动画变动
                        this.stepChange(value);
                        break;
                    case "PPTInfo": //ppt的原始信息
                        this.initCanvas(value);
                        break;
                    case "PPTResize": //ppt宽高变动
                        this.windowSize = [
                            ...value,
                            this.windowSize[3],
                            this.windowSize[4]
                        ];
                        break;
                }
            },
            false
        );
    },

    methods: {
        initCanvas(value) {
            let {
                cw,
                ch,
                mt,
                detail: { width, height, TotalSlides }
            } = value;
            this.windowSize = [cw, ch, mt, width, height];
        },
        stepChange(value) {
            Object.assign(this.state.pptObj, value)
            console.log(value);

        },
        pageChange(value) {
            Object.assign(this.state.pptObj, value)
        },
        setPage(type, slide = 1, step = 0) {
            let ppt = <HTMLIFrameElement>document.getElementById("ppt");
            ppt.contentWindow.postMessage(
                { data: type, value: { slide, step } },
                "*"
            );
        },
    }
}
export default WhiteBoard;