import {Controller} from '@hotwired/stimulus';
import {Modal} from 'bootstrap';
import {useDispatch} from 'stimulus-use';
import {showToast} from "../custom-js/toast.js";
// import $ from 'jquery';

// !!!!!!!!! deprecated -  use base-modal-form
export default class extends Controller {
    static targets = ['modal'];
    modal = null;

    connect() {
        useDispatch(this);
        this.element.addEventListener('turbo:submit-start', this.handleSubmitStart);
        this.element.addEventListener('turbo:submit-end', this.handleSubmitEnd);
    }

    disconnect() {
        this.element.removeEventListener('turbo:submit-start', this.handleSubmitStart)
        this.element.removeEventListener('turbo:submit-end', this.handleSubmitEnd)
    }

    async openModal(event) {
        const frame = this.modalTarget.querySelector('turbo-frame')
        frame.reload();
        this.modal = new Modal(this.modalTarget);
        this.modal.show();
    }

    handleSubmitEnd = (event) => {
        if (event.detail.success) {
            const frameId = event.target.getAttribute('data-reload-frame-id');
            if (frameId) {
                const frame = document.querySelector(`turbo-frame#${frameId}`);
                if (frame) {
                    frame.reload()
                }
            }
            // trigger event to update user names in other section of the page
            if (event.target.getAttribute('action').includes('/user/info')) {
                const formData = new FormData(event.target);
                event.currentTarget.dispatchEvent(new CustomEvent(
                        'user-form-data-saved',
                        {
                            bubbles: true,
                            detail: formData.get('form[firstName]') + ' ' + formData.get('form[lastName]')
                        }
                    )
                );
            }
            this.modal.hide();
            showToast('success', 'Saved successfully')
        }
        const submitButton = event.target.querySelector('[type="submit"]');
        submitButton.classList.remove('button-with-spinner');
        submitButton.removeAttribute('disabled');
    }
    handleSubmitStart = (event) => {
        const submitButton = event.target.querySelector('[type="submit"]');
        submitButton.classList.add('button-with-spinner');
        submitButton.setAttribute('disabled', true);
    }
}