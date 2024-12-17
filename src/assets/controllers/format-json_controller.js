import {Controller} from '@hotwired/stimulus'
import hljs from "highlight.js";

export default class extends Controller {

    connect() {
        this.highlight();
    }

    highlight() {
        const element = this.element.querySelector('code');
        const formattedJSON = this.formatJSON(JSON.parse(element.textContent.trim()));
        element.textContent = formattedJSON;
        hljs.highlightBlock(element);
    }
    formatJSON(json) {
        return JSON.stringify(json, null, 4);
    }
}