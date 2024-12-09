import {Controller} from '@hotwired/stimulus'
import axios from 'axios'
import {Modal} from 'bootstrap'
import {useDispatch} from 'stimulus-use';
import {showToast} from '../custom-js/toast.js';

export default class extends Controller {
    modal = null;
    modalElement = document.querySelector('.confirmationModal')

    connect() {
        useDispatch(this);
    }

    disconnect() {

    }

    async openModal(event) {
        let textClass = Array.from(this.element.classList).find(className => className.startsWith('text-'));

        const textValueClass = textClass ? textClass.slice(5) : 'primary'

        const iconContainer = this.modalElement.querySelector('.confirmationModalIconContainer')

        const buttonIcon = this.element.querySelector('i')
        let iClass = Array.from(buttonIcon.classList).find(className => className.startsWith('bi-'));
        if (!iClass) {
            iClass = 'bi-clipboard-check';
        }
        const icon = document.createElement('i')
        icon.classList.add('align-self-center', 'fs-2', 'bi', 'mx-auto')
        icon.classList.add(iClass)

        const iconContainerContent = document.createElement('div')
        iconContainerContent.classList.add('bg-' + textValueClass)
        iconContainerContent.classList.add('text-' + textValueClass)
        iconContainerContent.classList.add('iconPlaceholder', 'bg-opacity-10', 'rounded', 'd-flex', 'flex-shirnk-0', 'square-64')
        iconContainerContent.appendChild(icon)
        const oldContainer = iconContainer.querySelector('.iconPlaceholder')
        iconContainer.replaceChild(iconContainerContent, oldContainer)

        const title = this.element.dataset['modalTitle'] ? this.element.dataset['modalTitle'] : 'Confirm';
        const message = this.element.dataset['modalMessage'];
        const path = this.element.dataset['modalPath'];
        const reloadFrameId = this.element.dataset['reloadFrameId'];
        const gatherFromCheckboxes = this.element.dataset['modalGatherCheckboxes'];

        let ids = [];

        this.modalElement.querySelector('.confirmationModalTitle').textContent = title;
        this.modalElement.querySelector('.confirmationModalMessage').textContent = message;

        const submitButton = this.modalElement.querySelector('.confirmationModalButton');

        const newSubmitBtn = document.createElement('button')
        newSubmitBtn.dataset['submit'] = path

        newSubmitBtn.dataset['reloadFrameId'] = reloadFrameId;
        newSubmitBtn.classList.add('btn-' + textValueClass, 'confirmationModalButton', 'btn', 'text-center', 'w-100');
        newSubmitBtn.textContent = 'Confirm'

        newSubmitBtn.addEventListener('click', this.confirmAction);

        this.modalElement.querySelector('.actionButtons').replaceChild(newSubmitBtn, submitButton);

        if (gatherFromCheckboxes) {
            $('.select-row:checked').each(function () {
                ids.push(parseInt($(this).val()));
            });
        }

        newSubmitBtn.dataset['ids'] = ids.join('|');

        this.modal = new Modal(this.modalElement);
        this.modal.show();

        this.modalElement.addEventListener('hidden.bs.modal', (event) => {
            newSubmitBtn.removeEventListener('click', this.confirmAction);
        });
    }

    confirmAction = (event) => {
        const submitButton = event.currentTarget;
        submitButton.classList.add('button-with-spinner');
        submitButton.setAttribute('disabled', true)

        let ids = event.currentTarget.dataset['ids'] !== '' ? event.currentTarget.dataset['ids'].split('|') : [];
        let method = 'get';

        if (ids.length > 0) {
            method = 'post';
        }

        axios[method](
                event.currentTarget.dataset['submit'],
                JSON.stringify(ids)
            )
            .then(response => {
                this.modal.hide();
                showToast('success', response.data);
                const frameId = event.target.getAttribute('data-reload-frame-id');

                if (frameId !== 'undefined' && frameId !== undefined) {
                    const frame = document.querySelector(`turbo-frame#${frameId}`);
                    if (frame) {
                        frame.reload();
                    }
                } else {
                    setTimeout(() => {
                            window.location.reload()
                        }, 2000
                    );
                }
                submitButton.classList.remove('button-with-spinner');
                submitButton.removeAttribute('disabled');
            })
            .catch(error => {
                this.modal.hide();
                let msg = error.response.data;
                if (Object.prototype.toString.call(error.response.data) === '[object Object]') {
                    msg = error.response.statusText;
                }
                showToast('danger', msg);
                console.log(error)
                submitButton.classList.remove('button-with-spinner');
                submitButton.removeAttribute('disabled')
            })
        ;
    }
}