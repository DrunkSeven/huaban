const template = require("./index.html")
import './index.scss'
export default {
    template: template,
    data() {
        return {
            sharedState: this.state,
            recordUrl: ""
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
                this.player.currentTime(v);
            }
        }
    },
    mounted() {
        this.recordUrl = "http://lrep.jze100.com/alive/2020/6/jzjyu374/04d8258dad4a15eb2bc5b8ade0c3da12_jzjyu374.m3u8"
        setTimeout(() => {
            let that = this;
            this.player = videojs("example-video", {}, function onPlayerReady() {
                this.error = msg => {
                    console.log(msg);
                };
                this.on("timeupdate", function (v) {
                    that.state.currentTime = Math.floor(this.cache_.currentTime);

                });
                this.on("durationchange", function () {
                    that.state.duration = this.cache_.duration;
                });
            });
        }, 100);
    }
}