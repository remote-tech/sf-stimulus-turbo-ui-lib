import {Controller} from '@hotwired/stimulus'
import {frameLoading} from "./utils.js";

export default class extends Controller {

    localStorage = window.localStorage;
    searchInput = document.getElementById('listSearch');
    storageName = this.searchInput.getAttribute('data-storageName')
    recentSearch = JSON.parse(window.localStorage.getItem(this.storageName)) || []
    clearSearch = document.getElementById('clearSearch');

    connect() {
        this.searchInput.addEventListener('keydown', this.handleKeyDown)
        this.searchInput.addEventListener('blur', this.handleBlur)
        this.listenSearchSubmit(this.clearSearch, '')
    }


    disconnect() {
        this.searchInput.removeEventListener('keydown', this.handleKeyDown)
        this.searchInput.removeEventListener('blur', this.handleBlur)

    }

    handleKeyDown = (event) => {
        if (event.keyCode !== 13) {
            return;
        }

        const itemsFrame = document.getElementById('items-list');
        let srcUrl = itemsFrame.getAttribute('src');

        let url = new URL(srcUrl, window.location.origin);

        // DO NOT reset the existing filters since all filters have same priority
        // url.search = '';
        if (event.currentTarget.value.trim() === '') {
            url.searchParams.delete("filters[term]");
        } else {
            url.searchParams.set("filters[term]", event.currentTarget.value.trim());
            this.addSearchItem(event.currentTarget.value.trim())
        }

        itemsFrame.setAttribute('src', url.toString());
        frameLoading('table-rows')


        this.toggleClearSearch(event.currentTarget)
        // this.countAppliedFilters()
        this.handleBlur()
    }

    handleBlur = () => {
        this.localStorage.setItem(this.storageName, JSON.stringify(this.recentSearch));
    }

    handleFocus = (event) => {
        const searchItemsContainer = document.getElementById('searchItems')
        if (this.recentSearch.length === 0) {
            searchItemsContainer.innerHTML = 'No searches yet';
            return;
        }

        searchItemsContainer.innerHTML = '';

        for (let i = this.recentSearch.length - 1; i >= 0; i--) {
            let newP = document.createElement('p');
            newP.textContent = this.recentSearch[i];
            newP.classList.add('hover-secondary');
            newP.classList.add('p-1');
            this.listenSearchSubmit(newP, newP.textContent)
            let newDiv = document.createElement('div');
            newDiv.appendChild(newP)
            searchItemsContainer.appendChild(newDiv)
        }
    }

    listenSearchSubmit = (elem, value) => {
        const enterKeyEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            keyCode: 13,
            code: 'Enter',
            which: 13,
            bubbles: false,
        });

        elem.addEventListener('click', (event) => {
            this.searchInput.value = value;
            this.searchInput.dispatchEvent(enterKeyEvent);
        })
    }

    addSearchItem = (value) => {
        if (value.trim() === '') {
            return;
        }
        for (let i = 0; i < this.recentSearch.length; i++) {
            if (this.recentSearch[i] === value) {
                return;
            }
        }
        this.recentSearch.push(value);
        if (this.recentSearch.length > 5) {
            this.recentSearch.shift();
        }
    }

    toggleClearSearch = (currentTarget) => {
        if (currentTarget.value !== '') {
            this.clearSearch.classList.add('d-block');
        } else {
            this.clearSearch.classList.remove('d-block');
        }
    }

    countAppliedFilters = (event) => {

        const formData = new FormData(document.getElementById('listFilterForm')); // Get form data
        const formDataObject = Object.fromEntries(formData.entries());

        const itemsFrame = document.getElementById('items-list');

        let srcUrl = itemsFrame.getAttribute('src');
        let url = new URL(srcUrl);
        let activeFilters = 0;
        for (const [name, value] of Object.entries(formDataObject)) {
            if (value !== '') {
                activeFilters++
            }
        }
        if (this.searchInput.value !== '') {
            activeFilters++;
        }

        const target = document.getElementById('activeFiltersCount')

        if (activeFilters === 0) {
            target.innerHTML = '';
        } else {
            target.innerHTML = '(' + activeFilters + ')'
        }
    }
}