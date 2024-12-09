import {Controller} from '@hotwired/stimulus'

export default class extends Controller {
    connect() {
        this.handleFetch()
    }

    handleFetch = () => {
        const firstLink = document.querySelector('#tabs-nav .nav a');

        let currentHashId = window.location.hash.substring(1);
        if ('' === currentHashId || null === currentHashId) {
            currentHashId = firstLink.getAttribute('id');
        }
        try {
            this.element.src = document.getElementById(currentHashId).getAttribute('data-href');
        } catch (e) {
            this.element.src = firstLink.getAttribute('data-href');
        }
    }
}