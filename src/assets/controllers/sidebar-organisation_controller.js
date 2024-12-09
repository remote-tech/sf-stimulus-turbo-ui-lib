import {Controller} from '@hotwired/stimulus'
import {Modal} from 'bootstrap';
import axios from 'axios'
import {showToast} from "../custom-js/toast.js";

export default class extends Controller {
    static values = {
        ajaxPath: String
    }

    connect() {
        $(this.element).on('change', this.handleChange);
    }

    disconnect() {
        $(this.element).off('change', this.handleChange);
    }

    handleChange = (event) => {

        const selector = $(this.element);
        const modal = new Modal(document.getElementById('add-workspace'));
        const selectedIndex = selector.val();

        if (selectedIndex !== '0') {
            this.setWorkspace(selectedIndex);
        } else {
            selector.val(selectedIndex).trigger('change.select2', [{trigger: 'silent'}]);
            modal.show();
        }
    }

    setWorkspace = async (workspaceId) => {

        try {
            const response = await axios
                .get(
                    this.ajaxPathValue + '?workspaceId=' + workspaceId
                )
            location.reload()
        } catch (error) {
            if (error.code === 'ERR_CANCELED') {
                return;
            }

            console.error("Error selecting workspace", error);
            showToast('danger', error.response.data.error)
        }
    }
}