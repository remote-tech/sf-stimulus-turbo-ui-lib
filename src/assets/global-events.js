import {showToast} from './custom-js/toast.js';
import {initBootstrapSelect, initDropdown, initTooltips} from "./custom-js/plugins_init";

import jquery from 'jquery';

const $ = jquery;
// const jQuery = jquery;
// window.$ = window.jQuery = $;


// Set up global event listeners
function initializeGlobalEventListeners(callbacks) {
    document.addEventListener('turbo:frame-missing', function (event) {
        console.log('turbo:frame-missing', event);
        const {detail: {response, visit}} = event;
        event.stopPropagation();
        event.preventDefault();

        if (response.redirected === true) {
            showToast('danger', 'A page reload is needed. Click <a href="javascript:location.reload();">here</a> to refresh');
            return;
        }
        if (callbacks !== undefined)
            callbacks.hasOwnProperty('frameMissing') ? callbacks['frameMissing'](event) : null;

        console.log('Failed to retrieve frame content', event);
        showToast('danger', 'An error occurred. Please try again. If the problem persists, contact Customer Support');
    });


    document.addEventListener('DOMContentLoaded', function (event) {
        console.log('DOMContentLoaded', event);
        initBootstrapSelect(document);
        initTooltips(document);
        initDropdown(document);
        if (callbacks !== undefined)
            callbacks.hasOwnProperty('domLoaded') ? callbacks['domLoaded'](event) : null;
    });

    document.addEventListener("turbo:frame-render", function (event) {
        console.log('turbo:frame-rendered', event);
        initBootstrapSelect(event.target);
        initTooltips(event.target);
        initDropdown(event.target);
        if (callbacks !== undefined)
            callbacks.hasOwnProperty('frameRendered') ? callbacks['frameRendered'](event) : null;
    });

//// **********IMPORTANT*******
// NOTE: for turbo streams loading events on every <turbo-stream> elem add  the  `stream-load` stimulus  controller to init other plugins
}

export {initializeGlobalEventListeners};