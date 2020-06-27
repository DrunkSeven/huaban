const template = require("./index.html")
import icon_off from '../../assets/img/icon_off@2x.png';
import icon_on from '../../assets/img/icon_on@2x.png';
import './index.scss'
export default {
    template: template,
    data() {
        return {
            icon_off: icon_off,
            icon_on: icon_on,
            sharedState: this.state,
            currentTime: 0,
            currentTimeStr: "0:00",
            endTimeStr: "0:00",
            canMoveTime: true,
            timer: 0 //计时器
        };
    },
    watch: {
        'sharedState.duration': {
            handler: function (v) {
                this.endTimeStr = this.getTimeStr(v);
                console.log(this.endTimeStr);
            },
        },
        'sharedState.currentTime'(v) {
            this.currentTimeStr = this.getTimeStr(v);
            this.$refs.dot.style.left =
                (this.state.currentTime / this.state.duration) * 100 + "%";
            this.$refs.line.style.width = this.$refs.dot.style.left;
        },
    },
    mounted() {
        console.log()
    },
    methods: {
        changeState() {
            this.state.isplay = !this.state.isplay
        },

        mousedown(e) {
            this.canMoveTime = true;
        },
        mousemove(e) {
            if (this.canMoveTime && e.layerX != 0) {
                this.$refs.dot.style.left = e.layerX + "px";
                this.$refs.line.style.width = e.layerX + "px";
            }
        },
        mouseover(e) {
            this.canMoveTime = false;
        },
        mouseup(e) {
            this.canMoveTime = false;
            this.$refs.dot.style.left = e.layerX + "px";
            this.$refs.line.style.width = e.layerX + "px";
            this.state.currentTime =
                (e.layerX * this.state.duration) / this.$refs.opacityBar.clientWidth;

        },
        getTimeStr(duration: number) {
            let theTime = Math.floor(duration); // 秒
            let middle: number = 0; // 分
            let hour: number = 0; // 小时
            let result: any = "";
            if (theTime > 59) {
                middle = Math.floor(theTime / 60);
                result = Math.floor(theTime) - middle * 60;
                result = result > 9 ? result : "0" + result;
                theTime = Math.floor(theTime % 60);
                if (middle > 59) {
                    hour = Math.floor(middle / 60);
                    middle = Math.floor(middle % 60);
                }
            } else {
                result =
                    "0:" +
                    (Math.floor(theTime) > 9 ? Math.floor(theTime) : "0" + Math.floor(theTime));
            }
            if (middle > 0) {
                result = "" + Math.floor(middle) + ":" + result;
            }
            if (hour > 0) {
                result = "" + Math.floor(hour) + ":" + result;
            }
            return result;
        }
    }
}
