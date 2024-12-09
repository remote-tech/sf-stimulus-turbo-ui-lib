import {Controller} from "@hotwired/stimulus";

export default class extends Controller {

    workspacesContainer = null
    servicesContainer = null
    workspacesList = null
    servicesList = null
    wsAccordionButton = null
    srvAccordionButton = null

    connect() {
        this.workspacesContainer = this.element.querySelector('.workspaces')
        this.servicesContainer = this.element.querySelector('.services')
        this.workspacesList = this.workspacesContainer.querySelector('.workspaces-list')
        this.servicesList = this.servicesContainer.querySelector('.services-list')
        this.wsAccordionButton = this.workspacesContainer.querySelector('.ws-accordion-btn')
        this.srvAccordionButton = this.servicesContainer.querySelector('.srv-accordion-btn')
    }

    toggleWorkspaces = (event) => {
        if (parseInt(event.currentTarget.value) !== 0){
            this.workspacesContainer.classList.add('d-none')
        } else {
            this.workspacesContainer.classList.remove('d-none')
        }
    }

    filterWorkspaces = (event) => {
        const searchInput = event.currentTarget
        const wsList = this.workspacesList
        if (this.wsAccordionButton.getAttribute('aria-expanded') === 'false') {
            this.wsAccordionButton.click()
        }
        event.currentTarget.onkeyup = function() {
            wsList.querySelectorAll('li').forEach(function(liElem) {
                $(liElem).show();
                const label = liElem.querySelector('label').innerHTML
                if (!label.toLowerCase().includes(searchInput.value.toLowerCase())) {
                    $(liElem).hide();
                }
            })
        }
    }

    filterServices = (event) => {
        const searchInput = event.currentTarget
        const srvList = this.servicesList
        if (this.srvAccordionButton.getAttribute('aria-expanded') === 'false') {
            this.srvAccordionButton.click()
        }
        searchInput.onkeyup = function() {
            srvList.querySelectorAll('li.srv').forEach(function(liElem) {
                $(liElem).show();
                const label = liElem.querySelector('span.srv-name').innerHTML
                if (!label.toLowerCase().includes(searchInput.value.toLowerCase())) {
                    $(liElem).hide();
                }
            })
        }
    }
}