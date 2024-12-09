import {BaseFilter} from "./BaseFilters.js";

export class IntFilter extends BaseFilter {
    operators = {'eq': 'equals', 'gt': 'greater than', 'lt': 'less than'}

    getIconByOperation(operation) {
        let icon = '<b>=</b>';
        if (operation === 'gt') {
            icon = '<b>></b>';
        }

        if (operation === 'lt') {
            icon = '<b><</b>';
        }

        return icon
    }

    getOperationTemplate = (operation = null, icon = null) => {
        let template =
            '<select class="form-select operator-value" name="operation" data-action="change->listing--expression#changeIcon">'

        Object.entries(this.operators).forEach(([key, value]) => {
            let selected = operation === key ? 'selected="selected"' : ''
            template += '<option ' + selected + ' value="' + key + '">' + value + '</option>'
        })

        template += '</select>'

        return template
    }

    getValueTemplate = (value = '') => {
        return '<input type="number" step="1" class="value form-control value-int" value="' + value + '" name="value" placeholder="Int Value">'
    }
}