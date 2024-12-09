export class FilterBadge {
    constructor(attribute, attributeLabel, operator, icon, value) {
        this.attribute = attribute || null;
        this.attributeLabel = attributeLabel || null;
        this.operator = operator || null;
        this.icon = icon || null;
        this.value = value;
    }

    getHtml() {
        return '<span type="button" data-action="click->listing--expression#openModal" class="filter-item badge rounded bg-opacity-10 bg-primary text-primary py-2 mx-1" data-id="' + this.attribute + '">' +
            '         <span  class="fw-normal attribute" data-attribute="' + this.attribute + '" data-operator="' + this.operator + '">' + this.attributeLabel + ' ' + this.icon + ' </span> ' +
            '         <span class="value">' + this.value + '</span>' +
            '         <i class="bi bi-x ms-2" data-action="click->listing--expression#removeFilter"></i>' +
            '       </span>'
    }
}