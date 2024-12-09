import {Controller} from '@hotwired/stimulus'
import {showToast} from "../../custom-js/toast.js";

export default class extends Controller {
    listActionsClass = '.list-actions';
    rowCheckboxClass = '.select-row';
    selectedCountClass = '.selected-count';

    toggleAll = () => {
        let container = $(this.element);
        let element = $(event.currentTarget);
        let isChecked = element.is(":checked");

        container.find(this.rowCheckboxClass).prop('checked', isChecked);

        this.toggleActions();
    }

    toggleActions = () => {
        let container = $(this.element);
        let actionsContainer = $(this.listActionsClass);
        let countChecked = container.find(this.rowCheckboxClass + ':checked').length;
        if (countChecked > 0) {
            actionsContainer.find(this.selectedCountClass).text(countChecked);
            actionsContainer.removeClass('d-none');
        } else {
            actionsContainer.addClass('d-none');
        }
    }

    exportData = (event) => {
        event.stopPropagation();

        const csvRows = this.getExportData()

        this.downloadCSVFile(csvRows.join('\n'), 'export.csv')
    }

    getExportData = () => {
        const ctxt = this;

        const tableHeaders = document.querySelectorAll('#items-listing-table thead th');
        let headers = [];

        tableHeaders.forEach((th, index) => {
            const elem = th.querySelector('.copy-value');
            if (elem !== null) {
                headers.push(ctxt.removeHTMLTagsAndSpecialChars(elem.innerHTML))
            }
        });

        const csvRows = [];

        csvRows.push(headers.join('\t')); // Join headers with commas


        $('.select-row').each(function () {
            if (!$(this).is(':checked')) {
                return;
            }
            let columns = [];

            $(this).closest('tr').find('td, th').not('.select-row-td').each(function () {
                let part = $($(this).find('.copy-value')[0]).html()
                if (typeof part === 'string') {
                    part = ctxt.removeHTMLTagsAndSpecialChars(part)
                    if (part.trim() === '') {
                        part = '--'
                    }
                }
                columns.push(part ? part.trim() : '--');
            });
            csvRows.push(columns.join('\t'));
        });

        return csvRows;
    }

    copyData = () => {
        const data = this.getExportData();
        this.copyToClipboardWithBrowserCompatibility(data.join('\n'));
    }

    reset = () => {
        let isChecked = false;

        $('.select-all, .select-row').prop('checked', isChecked);

        this.toggleActions();
    }

    copyToClipboardWithBrowserCompatibility = (text) => {
        let textArea = document.createElement("textarea");
        textArea.value = text;

        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            let successful = document.execCommand('copy');
            let msg = successful ? 'successful' : 'unsuccessful';
            showToast('success', 'Copied successfully')
        } catch (err) {
            showToast('danger', 'Copy failed')
            console.error('Unable to copy', err);
        }

        document.body.removeChild(textArea);
    }

    removeHTMLTagsAndSpecialChars = (str) => {
        return str.replace(/<\/?[^>]+(>|$)/g, "").replace(/[\r\n\t]/g, "").replace(/\s+/g, " ");
    }

    downloadCSVFile = (csvData, filename) => {
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', filename);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}