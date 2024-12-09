export class BaseFilter {
    constructor(name, values) {
        this.name = name || '';
        this.values = values || [];
    }

    processHtml ()  {
        document.querySelectorAll('.operation-container select.bootstrapStyle, .value-container select.bootstrapStyle').forEach(
            selector => {
                $(selector).select2({
                    theme: 'bootstrap-5',
                    dropdownParent: $(selector).parent()
                });
            }
        )
    }
}