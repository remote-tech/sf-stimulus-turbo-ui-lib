import {Controller} from '@hotwired/stimulus'
import {frameLoading} from "./utils.js"

export default class extends Controller {
    links = null;

    connect() {
        this.links = this.element.querySelectorAll("a.main-link")

        this.links.forEach(link => {
            link.addEventListener('click', this.handleClick)
        });
        this.links[0].classList.remove('text-muted')
    }

    disconnect() {
        this.links.forEach(link => {
            link.removeEventListener('click', this.handleClick)
        });
    }

    handleClick = (event) => {

        const itemsFrame = document.getElementById('items-list');
        let srcUrl = itemsFrame.getAttribute('src');

        let url = new URL(srcUrl, window.location.origin);

        for (const [name, value] of url.searchParams) {
            if (name.startsWith('filters[')) {
                url.searchParams.delete(name);
            }
        }
        const link = event.currentTarget;
        const filter = JSON.parse(link.dataset['filters']);

        this.processCssSelection(link)

        for (const [name, value] of Object.entries(filter)) {
            if (value !== null) {
                url.searchParams.set(`filters[${name}]`, value.toString());
            }
        }

        itemsFrame.setAttribute('src', url.toString());

        frameLoading('table-rows')
    }

    processCssSelection = (selectedLink) => {
        this.links.forEach(link => {
            link.classList.add('text-muted')
            if (link === selectedLink) {
                link.classList.remove('text-muted')
            }
        });
    }
}