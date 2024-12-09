import {Controller} from '@hotwired/stimulus';
import IntlTelInput from 'intl-tel-input'
import * as utils from 'intl-tel-input/build/js/utils.js'
import('intl-tel-input/build/css/intlTelInput.min.css')

export default class extends Controller {
    telWidget = null
    telElem = null
    parentForm = null

    // NOTE: Always set the controller to the parent of the tel input, and not directly on the input
    connect() {
        this.telElem = this.element.querySelector("input[type='tel']")
        this.parentForm = this.findParentForm()
        this.telWidget = new IntlTelInput(this.telElem, {
            utilsScript: utils,
            autoInsertDialCode: true,
            initialCountry: 'gb',
            nationalMode: false
        });

        this.telElem.addEventListener('input', this.handleChange);
        this.telElem.addEventListener('countrychange', this.handleChange);
        // this.telElem.addEventListener("countrychange", function() {
        //     // do something with iti.getSelectedCountryData()
        //     alert('changed')
        // });
    }

    disconnect() {
        this.telElem.removeEventListener('input', this.handleChange);
        this.telElem.removeEventListener('countrychange', this.handleChange);
    }

    handleChange = (event) => {
        this.parentForm.removeEventListener('submit', this.disableFormSubmit)

        if (this.telElem.value.trim() && this.telWidget.isValidNumberPrecise()) {
            this.telElem.style.color = 'black';
        } else {
            this.parentForm.addEventListener('submit', this.disableFormSubmit)
            this.telElem.style.color = 'red';
        }
    }
    findParentForm = () => {
        var parent = this.telElem.parentNode;

        while (parent !== null && parent.nodeName !== 'FORM') {
            parent = parent.parentNode;
        }

        return parent;
    }

    disableFormSubmit = (event) => {
        event.preventDefault()
    }
}