import {BaseFilter} from "./BaseFilters.js";

export class EnumFilter extends BaseFilter {
    operators = {'in': 'one or many of'};

    getIconByOperation(operation) {
        return '<b>()</b>';
    }

    getOperationTemplate = (operation = null, icon = null) => {
        return '<input class="form-control operator-value form-floating" readonly value="any of" />' +
            '<input type="hidden" class="operator-value" readonly name="operation" value="in" />'
    }

    getValueTemplate = (value = '', defaultValues = []) => {
        let template = '<select id="enumSelect" name="values[]" class="bootstrapStyle form-select" multiple>'

        let parts = []
        if (value !== '') {
            parts = value.split('|');
        }

        for (let i = 0; i < defaultValues.length; i++) {
            const [key, name] = defaultValues[i].split(":")
            let selected = (parts.includes(key) ? 'selected="true"' : '')
            template += '<option '+ selected +' value="' + key + '">' + name + '</option>'
        }
        template += '</select>'
        template += '<input id="enumValue" type="hidden" name="value" value="' + value + '" />'

        return template
    }

    processHtml() {
        super.processHtml();
        const input = $('#enumValue')
        const select = $('#enumSelect')
        select.on('change', function () {
            input.val($(this).val().join('|'))
        })
    }
}