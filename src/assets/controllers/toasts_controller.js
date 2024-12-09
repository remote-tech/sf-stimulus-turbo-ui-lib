import {Controller} from '@hotwired/stimulus';
import {showToast} from "../custom-js/toast.js";

export default class extends Controller {
    static values = {
        type: String,
        message: String
    };

    connect() {
        showToast(this.typeValue, this.messageValue)
    }

    disconnect() {
    }
}