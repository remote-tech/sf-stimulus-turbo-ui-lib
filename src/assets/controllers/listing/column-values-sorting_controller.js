import {Controller} from '@hotwired/stimulus'
import {frameLoading} from "./utils.js";

export default class ColumnSorting extends Controller {
    sortableItems = null;

    connect() {
        this.sortableItems = this.element.querySelectorAll("a.sort-link")
        this.sortableItems.forEach(link => {
            link.setAttribute('data-order', '')
            link.addEventListener('click', this.handleClick)
        });
    }

    disconnect() {
        this.sortableItems.forEach(link => {
            link.removeEventListener('click', this.handleClick)
        });
        this.sortableItems = null;
    }

    handleClick = (event) => {

        const selector = event.currentTarget;
        const itemsFrame = selector.closest('turbo-frame');
        let url = new URL(itemsFrame.getAttribute('src'), window.location.origin);

        let currentOrder = selector.getAttribute('data-order');
        let arrow = 'bi-arrow-down-up'

        // reset the current sort
        this.sortableItems.forEach(link => {
            link.setAttribute('data-order', '')
            let label = link.querySelector('div.item')
            let icon = label.querySelector('i')

            let newIcon = document.createElement('i');
            newIcon.className = 'bi '+ arrow ;

            label.replaceChild(newIcon, icon);
        });

        // remove the sort query string params
        const sortKeys = Array.from(url.searchParams.keys()).filter(key => key.startsWith('sort['));
        sortKeys.forEach(key => {
            url.searchParams.delete(key);
        });

        if (currentOrder === '') {
            currentOrder = 'asc';
            arrow = 'bi-arrow-up'
        }else if(currentOrder === 'asc'){
            currentOrder = 'desc';
            arrow = 'bi-arrow-down'
        } else {
            currentOrder = '';
        }

        const dbId = selector.getAttribute('data-id');
        selector.setAttribute('data-order', currentOrder)

        let label = selector.querySelector('div.item')
        let icon = label.querySelector('i')

        let newIcon = document.createElement('i');
        newIcon.className = 'bi '+ arrow ;

        label.replaceChild(newIcon, icon);

        url.searchParams.set("sort["+dbId+"]", currentOrder);

        itemsFrame.setAttribute('src', url.toString());
        frameLoading('table-rows')
    }
}