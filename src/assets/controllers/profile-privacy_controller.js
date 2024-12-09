import {Controller} from "@hotwired/stimulus";
import axios from 'axios'
import {showToast} from "../custom-js/toast.js";

export default class extends Controller {
    static values = {
        ajaxPath: String
    }

    connect() {
        this.element.addEventListener("change", this.handleChange.bind(this));
        this.controller = new AbortController();
    }

    handleChange(event) {
        const checkbox = event.target;

        this.disableOldRequest();

        const formData = new FormData();
        formData.append(checkbox.name, checkbox.checked);

        axios.post(this.ajaxPathValue, formData, {
            signal: this.controller.signal
        })
            .then(response => {
                showToast('success', 'Saved successfully')
            })
            .catch(error => {
                if (error.code === 'ERR_CANCELED') {
                    return;
                }
                showToast('danger', 'An error occurred')
            });
    }

    disableOldRequest() {
        this.controller.abort()
        this.controller = new AbortController();
    }
}