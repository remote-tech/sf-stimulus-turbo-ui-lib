import {BaseFilter} from "./BaseFilters.js";

export class StringFilter extends BaseFilter {
    operators = {'eq': 'equals', 'starts': 'starts with', 'ends': 'ends with', 'contains': 'contains'};

    getIconByOperation(operation) {
        let icon = '<b>=</b>';

        if (operation === 'contains') {
            icon = '<i class="bi bi-align-center"></i>';
        }

        if (operation === 'starts') {
            icon = '<i class="bi bi-align-start"></i>';
        }

        if (operation === 'ends') {
            icon = '<i class="bi bi-align-end"></i>';
        }

        return icon
    }

    getOperationTemplate = (operation = null, icon = null) => {

        if (icon == null) {
            icon = '<b>=</b>'
        }
        let template =   // '<span class="input-group-text bg-white">' + icon + '</span>' +
            '<select id="stringOpSelect" class="bootstrapStyle w-100 form-select border-start-0 ps-0 operator-value" name="operation" data-action="change->listing--expression#changeIcon">'

        Object.entries(this.operators).forEach(([key, value]) => {
            let selected = operation === key ? 'selected="selected"' : ''
            template +=
                '    <option ' + selected + ' value="' + key + '">' + value + '</option>'

        })

        template += '</select>'

        return template
    }

    getValueTemplate = (value = '') => {
        return '<input type="text" class="value form-control value-string" value="' + value + '" placeholder="Str Value" name="value">'

    }

    processHtml() {
        super.processHtml();
    }
}