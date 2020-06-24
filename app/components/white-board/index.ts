
import { parseElement } from '../../plugin/utils.js'
const html = require('./index.html')
export default class WhiteBoard extends HTMLElement {
    constructor() {
        super();
        let templateElem: any = parseElement(html)
        var content = templateElem.content.cloneNode(true);
        this.appendChild(content);
    }
}  