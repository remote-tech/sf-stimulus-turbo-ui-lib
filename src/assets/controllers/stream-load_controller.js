import {Controller} from '@hotwired/stimulus'
import {initTooltips, initBootstrapSelect} from "../custom-js/plugins_init.js";
import $ from 'jquery';

export default class extends Controller {
    connect() {
    }

    disconnect() {
        const targetId = $(this.element).attr('target')
        if (targetId === undefined || targetId === null || targetId === '') {
            return
        }

        const target = document.getElementById(targetId)
        if (target === null || target === undefined) {
            return
        }

        initTooltips(target)
        initBootstrapSelect(target)
    }
}