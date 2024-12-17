import {Tooltip, Dropdown} from "bootstrap";

import $ from 'jquery';
const jquery = $;
window.$ = window.jQuery = $;
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
    element.querySelectorAll('[data-bs-toggle="dropdown"]').forEach(elem => {
        elem.addEventListener('click',  () => {
            const dropdown = new Dropdown(elem);
            dropdown.toggle();
        });
    });
}