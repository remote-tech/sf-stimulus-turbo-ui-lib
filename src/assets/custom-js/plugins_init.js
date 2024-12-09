import {Tooltip} from "../../../../node_modules/bootstrap/dist/js/bootstrap.js";

import jquery from 'jquery';
import select2 from "select2";

// jquery.select2 = select2();

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