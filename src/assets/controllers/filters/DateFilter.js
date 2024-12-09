import {BaseFilter} from "./BaseFilters.js";
import BootstrapDateRangePicker from "../../../../node_modules/bootstrap-daterangepicker/daterangepicker.js";
import moment from "../../../../node_modules/moment/moment.js";

export class DateFilter extends BaseFilter {
    operators = {'between': 'between'}

    getIconByOperation(operation) {
        return '<b><></b>';
    }

    getOperationTemplate = (operation = null, icon = null) => {
        return '<input class="form-control operator-value" name="operation" readonly value="between" />'
    }

    getValueTemplate = (value = '') => {
        return '<input readonly type="text" name="value" value="' + value + '" class="value form-control" id="datePicker" placeholder="Select Date"/>'
    }

    processHtml = () => {
        super.processHtml()

        const picker = new BootstrapDateRangePicker(document.getElementById('datePicker'), {
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
}
