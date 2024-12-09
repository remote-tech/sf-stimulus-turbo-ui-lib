import {Controller} from '@hotwired/stimulus';
import {Modal} from 'bootstrap';
import {useDispatch} from 'stimulus-use';

export default class extends Controller {
    modal = null;
    modalElement = document.querySelector('.base-modal')
    modalFrame = this.modalElement.querySelector('.modal-frame')

    connect() {
        useDispatch(this);
    }

    disconnect() {
    }

    async openModal(event) {

        const title = this.element.dataset['modalTitle']
        const path = this.element.dataset['modalPath']

        this.modalElement.querySelector('.modal-title').textContent = title;
        this.modalFrame.setAttribute('src', path);

        this.modal = new Modal(this.modalElement);
        this.modal.show();

        this.modalElement.addEventListener('hidden.bs.modal', (event) => {
            // maybe add some generic actions
        });
    }
}