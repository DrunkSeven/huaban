const template = require("./index.html")
import './index.scss'
export default {
    template: template,
    props: {
        message: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            defaultImg:
                "http://file.ykt100.com:8880/group1/M00/10/11/rBBYB12uajWAUC8pAABDlCJE3ks723.png",
            msgLength: 0
        }
    },
    watch: {
        message(value) {
            var div = document.querySelector(".chat-container");
            setTimeout(() => {
                div.scrollTop = div.scrollHeight;
            }, 50);
        }
    },
    filters: {
        formateTime: function (time) {
            const value = new Date(parseInt(time));
            const format = val => (val > 9 ? val : `0${val}`);
            return `${format(value.getMonth() + 1)}/${format(
                value.getDate()
            )} ${format(value.getHours())}:${format(value.getMinutes())}`;
        }
    },
}