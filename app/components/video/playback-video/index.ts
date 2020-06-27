const template = require("./index.html")
import './index.scss'
export default {
    template: template,
    data() {
        return {
            sharedState: this.state,
            recordUrl: "",
            player: {}
        }
    },
    watch: {
        'sharedState.isplay': {
            handler: function (v) {
                v ? this.player.play() : this.player.pause();
            },
        },
        'sharedState.currentTime'(v, old) {
            if (v - old != 1) {
                this.player.currentTime = v
            }
        }
    },
    mounted() {
        this.recordUrl = "./static/ykt.mp4";
        this.player = <HTMLVideoElement>document.getElementById('ykt-video');
        this.player.addEventListener("timeupdate", (v) => {
            this.state.currentTime = Math.floor(this.player.currentTime);

        });
        this.player.addEventListener("durationchange", (v) => {
            this.state.duration = this.player.duration;
        });
    }
}