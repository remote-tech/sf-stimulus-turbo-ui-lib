import {Controller} from '@hotwired/stimulus';
import {frameLoading} from "./utils.js";
// import select2 from "select2";

export default class extends Controller {
    connect() {
        $(this.element).select2({theme: 'bootstrap-5', minimumResultsForSearch: -1,
            selectionCssClass: 'fs-14'});
        $(this.element).on('change', this.handleChange);
    }

    disconnect() {
        $(this.element).off('change', this.handleChange);
    }

    handleChange = (event) => {
        const selector = event.currentTarget;
        const paginatedFrame = selector.closest('turbo-frame');

        let srcUrl = paginatedFrame.getAttribute('src');

        let url = new URL(srcUrl, window.location.origin);

        url.searchParams.set("items", selector.value);

        paginatedFrame.setAttribute('src', url.toString())
        frameLoading('table-rows')
    }
}