import {Controller} from '@hotwired/stimulus'
import {Modal} from 'bootstrap';
import {frameLoading} from "./utils.js";
import {FilterBadge} from "../filters/FilterBadgeClass.js";
import {StringFilter} from "../filters/StringFilter.js";
import {IntFilter} from "../filters/IntFilter.js";
import {DateFilter} from "../filters/DateFilter.js";
import {EnumFilter} from "../filters/EnumFilter.js";
import morphdom from "morphdom";
import {showToast} from "../../custom-js/toast.js";
import $ from "jquery";
import select2 from "select2";

export default class extends Controller {
    operationContainerClass = '.operation-container';
    valueContainerClass = '.value-container';

    modal = null;
    form = null

    filterBadges = {}
    filterClasses = {}
    availableFilterClasses = {
        'StringFilter': StringFilter,
        'IntFilter': IntFilter,
        'DateFilter': DateFilter,
        'EnumFilter': EnumFilter,
    };

    connect() {

        this.form = $(this.element).find('form[name="dynamic-filters"]')

        this.initFilterClasses()

        console.log('Available filter classes for Dynamic Filters', this.filterClasses)

        this.initBadgesFromQS()

        if (Object.keys(this.filterBadges).length > 0) {
            this.createFilterBadgesView()
            this.updateFrameUrl()
        }

        console.log('FilterBbadges when connecting: ', this.filterBadges);
    }

    initFilterClasses = () => {
        Object.entries(this.availableFilterClasses).forEach(([identifier, className]) => {
            this.filterClasses[identifier] = new className('name', 'value')
        })
    }

    createFilterBadgesView = () => {
        console.log('createFilterBadgesView func call');
        const container = $(this.element);
        const $filtersContainer = container.find('.filter-badges-container')

        let clonedFContainer = $filtersContainer.clone()

        clonedFContainer.html('')

        Object.entries(this.filterBadges).forEach(([key, filterBadge]) => {
            clonedFContainer.prepend(filterBadge.getHtml())
        })
        morphdom($filtersContainer.get(0), clonedFContainer.get(0))
    }

    initBadgesFromQS = () => {
        const params = new URLSearchParams((new URL(window.location)).search);
        const filters = {};
        params.forEach((value, key) => {

            const match = key.match(/^filters\[(.+?)\]\[(.+?)\]$/);
            if (match) {
                const filterName = match[1];
                const filterProperty = match[2];

                if (!filters[filterName]) {
                    filters[filterName] = {};
                }
                filters[filterName][filterProperty] = value;
            }
        });

        // let mainContainer = $(this.element);
        // let $form = mainContainer.find('form[name="dynamic-filters"]')
        let options = this.form.get(0).querySelector('.attribute').querySelectorAll('option')

        Object.keys(filters).map(filterName => {
            let label = filterName
            let filterType = 'string'
            options.forEach(function (option) {
                if (option.value === filterName) {
                    filterType = option.dataset['type']
                    label = option.innerHTML
                }
            })

            let icon = this.getIconByOperation(filters[filterName]['op'], filterType)

            this.filterBadges[filterName] = new FilterBadge(filterName, label, filters[filterName]['op'], icon, filters[filterName]['value']);
        });
    }

    openModal = (event) => {
        console.log('openModal func call')
        this.resetFilterForm()

        const target = event.currentTarget

        const modalElement = $(this.element).find('.modal')[0]

        this.modal = new Modal(modalElement);

        const attrSelect = modalElement.querySelector('.attribute')
        // $(attrSelect.readonly = false

        // disable already active filters
        let options2 = attrSelect.querySelectorAll('option')
        const activeFilterIds = Object.keys(this.filterBadges)
        options2.forEach(function (option) {
            option.disabled = false
            if (activeFilterIds.includes(option.value)) {
                option.disabled = true
            }
        })

        // listen for changes to update form inputs based on filter type
        const context = this
        $(attrSelect).on('change', function (e) {
            context.changeOperator(e)
        })

        // check if we are on edit mode
        if (target.classList.contains('filter-item')) {
            // attrSelect.readonly = true
            // means we are on edit mode
            const filterBadgeId = target.dataset['id']

            let filterBadge = this.filterBadges[filterBadgeId];

            let options = attrSelect.querySelectorAll('option')
            let parsedEnumOptions = []
            let filterType = 'string'
            options.forEach(function (option) {
                if (option.value === filterBadgeId) {
                    filterType = option.dataset['type']
                    let enumOptions = option.dataset['options']
                    parsedEnumOptions = enumOptions.split("|");
                    option.selected = true
                    option.disabled = false
                } else {
                    option.disabled = true
                }
            })

            const filterInstance = this.getFilterClassInstance(filterType)

            if (filterInstance === null) {
                return
            }

            let opContainer = modalElement.querySelector(this.operationContainerClass);
            let valContainer = modalElement.querySelector(this.valueContainerClass);
            opContainer.innerHTML = filterInstance.getOperationTemplate(filterBadge.operator, filterBadge.icon)
            valContainer.innerHTML = filterInstance.getValueTemplate(filterBadge.value, parsedEnumOptions)
            filterInstance.processHtml()
        }

        $(attrSelect).select2({
            theme: 'bootstrap-5',
            dropdownParent: $(attrSelect).parent()
        });

        this.modal.show();

        modalElement.addEventListener('keydown', this.handleEnterKeyPress);

        modalElement.addEventListener('hidden.bs.modal', (event) => {
            modalElement.removeEventListener('keydown', this.handleEnterKeyPress)
        });
    }

    getFilterClassInstance = (identifier) => {

        const className = identifier.charAt(0).toUpperCase() + identifier.slice(1) + 'Filter'

        if (this.filterClasses.hasOwnProperty(className)) {
            return this.filterClasses[className]
        }

        showToast('danger', 'Filter of type `' + identifier + '` is not available')
        return null
    }

    handleEnterKeyPress = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            event.preventDefault();
            this.applyFilters()
        }
    }

    changeIcon = (event) => {
        let $element = $(event.currentTarget);

        let options = this.form.get(0).querySelector('.attribute').querySelectorAll('option')
        let filterType = 'string'
        options.forEach(function (option) {
            if (option.selected === true) {
                filterType = option.dataset['type']
            }
        })

        $element.siblings('.input-group-text').html(this.getIconByOperation($element.val(), filterType));
    }

    getIconByOperation(operation, filterType) {
        const filterClass = this.getFilterClassInstance(filterType)
        return filterClass.getIconByOperation(operation)
    }

    changeOperator(event) {
        console.log('changeOperator method call')
        let element = $(event.currentTarget).parent();
        let type = $('option:selected', element).attr('data-type');

        let options = $('option:selected', element).attr('data-options');
        let parsedOptions = []
        if (options !== '') {
            parsedOptions = options.split("|");
        }

        const filterInstance = this.getFilterClassInstance(type)

        if (filterInstance === null) {
            return
        }

        let opContainer = this.form.find(this.operationContainerClass);
        let valContainer = this.form.find(this.valueContainerClass);

        opContainer.html(filterInstance.getOperationTemplate())
        valContainer.html(filterInstance.getValueTemplate('', parsedOptions))
        filterInstance.processHtml()
    }

    applyFilters = () => {
        console.log('applyFilters  func call')

        const formData = this.form.serializeArray();
        const formObject = {};
        let error = false
        $.each(formData, function () {
            // validate the data is not empty
            if (this.value.trim() === '') {
                error = true
                return;
            }
            formObject[this.name] = this.value;
        });

        if (error === true) {
            showToast('danger', 'Please fill the filter form')
            return;
        }

        console.log('submitted form: ', formObject);

        let options = this.form.get(0).querySelector('.attribute').querySelectorAll('option')
        let filterType = 'string'
        let label = formObject.attribute
        options.forEach(function (option) {
            if (option.selected === true) {
                filterType = option.dataset['type']
                label = option.innerHTML
            }
        })

        let icon = this.getIconByOperation(formObject.operation, filterType)

        this.filterBadges[formObject.attribute] = new FilterBadge(formObject.attribute, label, formObject.operation, icon, formObject.value)

        this.createFilterBadgesView()

        this.updateFrameUrl()
        this.updatePageUrl()

        frameLoading('table-rows');

        this.modal.hide();
    }

    updateFrameUrl = () => {
        console.log('updateFrameUrls  func call')
        const itemsFrame = $('#items-list');

        let url = this.makeCleanUrl(itemsFrame);

        Object.entries(this.filterBadges).forEach(([key, filterBadge]) => {
            url.searchParams.set('filters[' + filterBadge.attribute + '][op]', filterBadge.operator);
            url.searchParams.set('filters[' + filterBadge.attribute + '][value]', filterBadge.value);
        })

        itemsFrame.attr('src', url.toString());
    }
    updatePageUrl = () => {
        const itemsFrame = $('#items-list');
        let srcUrl = itemsFrame.attr('src');
        let url = new URL(srcUrl, window.location.origin);

        const pageUrl = new URL(window.location.href);
        const newUrl = pageUrl.origin + pageUrl.pathname + url.search + pageUrl.hash;

        window.history.pushState({}, '', newUrl);
    }

    removeFilter = (event) => {
        console.log('removeFilter func call')
        event.stopPropagation();
        event.preventDefault();
        let $element = $(event.currentTarget).parent();

        let id = $element.get(0).dataset['id']
        frameLoading('table-rows');

        if (this.filterBadges.hasOwnProperty(id)) {
            delete this.filterBadges[id]
        }

        this.updateFrameUrl()
        this.updatePageUrl()
        this.createFilterBadgesView()
    }

    makeCleanUrl = (itemsFrame) => {
        console.log('make clean Url  func call')

        let srcUrl = itemsFrame.attr('src');
        let url = new URL(srcUrl, window.location.origin);

        let keysToDelete = [];
        for (const [name, value] of url.searchParams) {
            if (name.startsWith('filters[')) {
                keysToDelete.push(name);
            }
        }
        for (const key of keysToDelete) {
            url.searchParams.delete(key);
        }

        return url;
    }

    resetFilters = () => {
        ('reset filters  func call')
        this.element.reset()
        this.applyFilters();
    }

    resetFilterForm = () => {
        this.form.find('.attribute').prop('selectedIndex', 0)
        let opContainer = this.form.find(this.operationContainerClass);
        opContainer.html('')
        let valContainer = this.form.find(this.valueContainerClass);
        valContainer.html('')
    }
}