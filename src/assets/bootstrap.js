
//  jquery
import jquery from 'jquery';

const $ = jquery;
const jQuery = jquery;
window.$ = window.jQuery = $;

import {showToast} from "./custom-js/toast.js";
import {initTooltips, initBootstrapSelect, initDropdown} from "./custom-js/plugins_init.js";

document.addEventListener('turbo:frame-missing', function(event) {
    const { detail: { response, visit } } = event;
    event.stopPropagation();
    event.preventDefault()
    if (response.redirected === true) {
        showToast('danger', 'A page reload is  needed. Click <a href="javascript:location.reload();">here</a> to refresh');
        return;
    }

    console.log('Failed to retrieve frame Content', event);
    showToast('danger', 'An error occurred. Please try again. If problem persist contact Customer Support')
});

document.addEventListener('DOMContentLoaded', function(event) {
    initBootstrapSelect(document);
    initTooltips(document);
    initDropdown(document);
});
document.addEventListener("turbo:frame-render", function(event) {
    initBootstrapSelect(event.target);
    initTooltips(event.target);
    initDropdown(event.target);
});

//// **********IMPORTANT*******
// NOTE: for turbo streams loading events on every <turbo-stream> elem add  the  `stream-load` stimulus  controller to init other plugins