import {Tooltip, Dropdown} from "bootstrap";

import $ from 'jquery';
// const jquery = $;
// window.$ = window.jQuery = $;
import select2 from "select2";

export function initBootstrapSelect(element) {
    element.querySelectorAll('select.bootstrapStyle').forEach(
        selector => {
            $(selector).select2({
                theme: 'bootstrap-5',
                dropdownParent: $(selector).parent()
            });
        }
    )
}

export function initTooltips(element) {
    element.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(elem => {
        new Tooltip(elem)
    });
}

export function initDropdown(element) {
    // this seems is not needed - maybe use it in the future
    // element.querySelectorAll('[data-bs-toggle="dropdown"]').forEach(elem => {
    //     alert('gfhf');
    //     elem.addEventListener('click',  () => {
    //         const dropdown = new Dropdown(elem);
    //         dropdown.toggle();
    //     });
    // });
}