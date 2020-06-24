import io from "socket.io-client";
import header from "./components/web-header";
import WhiteBoard from './components/white-board'
import "./main.scss"
new Vue({
    el: '#app',
    components: {
        'web-header': header
    },
    data() {
        return {

        }
    },
    mounted() {
        window.customElements.define('white-board', WhiteBoard);
    }
})