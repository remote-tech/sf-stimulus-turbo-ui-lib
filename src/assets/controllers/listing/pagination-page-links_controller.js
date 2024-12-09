import {Controller} from '@hotwired/stimulus';
import {frameLoading} from "./utils.js";

export default class extends Controller {
    links = null;

    connect() {
        this.links = this.element.querySelectorAll('a')
        this.links.forEach(link => {
            link.addEventListener('click', this.handleClick)
        })
    }

    disconnect() {
        this.links.forEach(link => {
            link.removeEventListener('click', this.handleClick);
        });
    }

    handleClick = (event) => {
        const selector = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        const paginatedFrame = selector.closest('turbo-frame');

        paginatedFrame.setAttribute('src', selector.getAttribute('href'))
        frameLoading('table-rows')
    }
}