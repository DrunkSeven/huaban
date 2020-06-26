import io from "socket.io-client";
import WebHeader from "./components/web-header";
import WhiteBoard from './components/white-board'
import PlaybackChat from './components/chat/playback-chat'
import PlaybackVideo from './components/video/playback-video'
import PlaybackCtrl from './components/playback-ctrl'
import state from './plugin/shareData'
import PlaybackWBControler from './controler/PlaybackWB'
import "./style/main.scss"
Vue.prototype.state = state;
new Vue({
    el: '#app',
    components: {
        WebHeader,
        WhiteBoard,
        PlaybackChat,
        PlaybackVideo,
        PlaybackCtrl
    },
    data() {
        return {
            sharedState: this.state,
            title: "初一春季语文1星---兼容性专用3",
            recordUrl: "http://lrep.jze100.com/alive/2020/6/jzjyu374/04d8258dad4a15eb2bc5b8ade0c3da12_jzjyu374.m3u8",
            pptListIndex: 0,
            objListIndex: 0,
            whiteboardObj: {
                pptList: []
            },
            time: 0
        }
    },
    watch: {
        'sharedState.currentTime'(v, old) {
            this.time = v;
            let l = this.whiteboardObj.pptList.length;
            if (v - old != 1) {
                this.pptListIndex = 0;
                this.objListIndex = 0
                wb.clear()
            }
            if (this.pptListIndex < l) {
                let pptObj = { slide: 1, step: 0, pptId: 1 }
                for (let i = this.pptListIndex; i < l; i++) {
                    //infoindex用于记录上一次处理到第几条消息,处理过的消息不再重复处理
                    let obj = this.whiteboardObj.pptList[i];
                    if (obj.time / 1000 <= v) {
                        pptObj = obj;
                    } else {
                        break;
                    }
                }
                if (
                    (pptObj.slide != this.state.pptObj.slide ||
                        pptObj.step != this.state.pptObj.step)
                ) {
                    console.log(pptObj.slide, this.state.pptObj.slide,
                        pptObj.step, this.state.pptObj.step);
                    this.$refs.WhiteBoard.setPage(GOPAGE, pptObj.slide, pptObj.step);
                    wb.clear()
                }
                else {
                    this.setTempList(pptObj)
                }

            }
        },
        'sharedState.pptObj': {
            handler: function (v) {
                this.setTempList(v)
            }, deep: true,
            immediate: true
        }
    },
    mounted() {
        for (let i = 0; i < whiteboardData.length; i++) {
            const e = whiteboardData[i];
            if (e.action == GOPAGE) {
                this.whiteboardObj.pptList.push(e)
            } else if (e.action == ONMOUSEUP) {
                let key = e.pptId + '-' + e.slide
                if (!this.whiteboardObj[key]) {
                    this.whiteboardObj[key] = []
                }
                this.whiteboardObj[key].push(e)
            }
        }
        console.log(this.whiteboardObj.pptList);

        let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas')
        wb = new PlaybackWBControler(canvas)
    },
    methods: {
        setTempList(v) {
            let key = v.pptId + '-' + v.slide;
            let list = this.whiteboardObj[key];
            if (list) {
                let tempList = []
                for (let i = this.objListIndex; i < list.length; i++) {
                    const e = list[i];
                    if (e.time < this.time * 1000) {
                        tempList.push(e)
                    } else {
                        this.objListIndex = i
                        break;
                    }
                }
                wb.tempList = tempList;
            }
        }
    }
})