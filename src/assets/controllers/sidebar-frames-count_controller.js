import {Controller} from '@hotwired/stimulus'

export default class extends Controller {

    connect() {
        if (localStorage.getItem(this.element.id) !== null) {
            this.element.innerHTML = localStorage.getItem(this.element.id);
        }
        this.element.addEventListener('turbo:frame-load', this.onFrameLoad);
    }

    onFrameLoad = (event) => {
        // update the local storage
        localStorage.setItem(this.element.id, event.currentTarget.innerHTML)
    }
}