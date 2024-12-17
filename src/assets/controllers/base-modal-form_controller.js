import {Controller} from '@hotwired/stimulus';
import {Modal} from 'bootstrap';
import {useDispatch} from 'stimulus-use';
import {showToast} from "../custom-js/toast.js";
import modalForm_controller from "./modal-form_controller.js";
// import $ from 'jquery';

export default class extends modalForm_controller {
    modal = null;
    modalElement = document.querySelector('.base-modal')
    modalFrame = this.modalElement.querySelector('.modal-frame')
    reloadFrameId = null

    connect() {
        useDispatch(this);
    }

    disconnect() {

    }

    async openModal(event) {

        console.log(event);
        const title = this.element.dataset['modalTitle']
        const path = this.element.dataset['modalPath']
        this.reloadFrameId = this.element.dataset['reloadFrameId']

        this.modalElement.querySelector('.modal-title').textContent = title;
        this.modalFrame.setAttribute('src', path);

        this.modal = new Modal(this.modalElement);
        this.modal.show();

        // add event listeners
        this.modalFrame.addEventListener('turbo:submit-start', this.handleSubmitStart);
        this.modalFrame.addEventListener('turbo:submit-end', this.handleSubmitEnd);
        this.modalFrame.addEventListener('turbo:frame-load', this.setFormAction)

        this.modalElement.addEventListener('hidden.bs.modal', (event) => {
            this.modalFrame.removeEventListener('turbo:submit-start', this.handleSubmitStart)
            this.modalFrame.removeEventListener('turbo:submit-end', this.handleSubmitEnd)
            this.modalFrame.removeEventListener('turbo:frame-load', this.setFormAction)
        });
    }

    setFormAction = (event) => {
        let frame = this.modalFrame
        const formInFrame = frame.querySelector('form');
        if (formInFrame) {
            formInFrame.action = frame.getAttribute('src');
            console.log('Form action modified:', formInFrame.action);
        }
    }

    handleSubmitEnd = (event) => {
        if (event.detail.success) {
            if (event.detail.fetchResponse.response.redirected === true) {
                showToast('danger', 'A page reload is  needed. Click <a href="javascript:location.reload();">here</a> to refresh');
                return;
            }

            if (null !== this.reloadFrameId && undefined !== this.reloadFrameId) {
                const frame = document.querySelector(`turbo-frame#${this.reloadFrameId}`);
                if (frame) {
                    frame.reload()
                }
            } else {
                setTimeout(() => {
                        window.location.reload()
                    }, 1000
                );
            }
            // trigger event to update user names in other section of the page
            if (event.target.getAttribute('action').includes('/user/info')) {
                const formData = new FormData(event.target);
                event.currentTarget.dispatchEvent(new CustomEvent(
                        'user-form-data-saved',
                        {
                            bubbles: true,
                            detail: formData.get('user_info_form[firstName]') + ' ' + formData.get('user_info_form[lastName]')
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