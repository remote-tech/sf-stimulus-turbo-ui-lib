import {Controller} from '@hotwired/stimulus'
import BootstrapDateRangePicker from 'bootstrap-daterangepicker'
import moment from 'moment'
import('bootstrap-daterangepicker/daterangepicker.css')
import {frameLoading} from "./utils.js";

export default class extends Controller {
    connect() {
        const lastSeenRange = this.generateDatePicker('lastSeenRange');
        const createdAtRange = this.generateDatePicker('createdAtRange');
    }

    generateDatePicker = (elemId) => {
        const picker = new BootstrapDateRangePicker(document.getElementById(elemId), {
            "showDropdowns": false,
            'locale': {
                'format': 'YYYY-MM-DD',
            },
            ranges: {
                'Today': [moment(), moment().add(1, 'days')],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(0, 'days')],
                'Last Week': [moment().subtract(6, 'days'), moment()],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()]
            },
            "alwaysShowCalendars": true, //this does not work (when false) with 'autoUpdateInput': false and the event listeners below
            "opens": "center",
            "autoApply": false,
            'autoUpdateInput': false

        });
        picker.element.on('apply.daterangepicker', function (ev, picker) {
            $(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'));
        });

        picker.element.on('cancel.daterangepicker', function (ev, picker) {
            $(this).val('');
        });
        return picker;
    }

    applyFilters = () => {
        const formData = new FormData(this.element); // Get form data
        const formDataObject = Object.fromEntries(formData.entries());

        const itemsFrame = document.getElementById('items-list');

        let srcUrl = itemsFrame.getAttribute('src');
        let url = new URL(srcUrl, window.location.origin);
        for (const [name, value] of Object.entries(formDataObject)) {
            if (value.trim() === '') {
                url.searchParams.delete(`filters[${name}]`)
            } else {
                url.searchParams.set(`filters[${name}]`, value.toString());
            }
        }

        itemsFrame.setAttribute('src', url.toString());
        frameLoading('table-rows')
    }

    resetFilters = () => {
        this.element.reset()
        this.applyFilters();
    }
}