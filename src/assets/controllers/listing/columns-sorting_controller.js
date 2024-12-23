import {Controller} from '@hotwired/stimulus'
import $ from "jquery";

export default class extends Controller {
    sortableList = $(this.element).find('.sortable-container')[0];
    draggedItem = null;
    currentOrder = {}
    visibilityChecks = {}
    listingName = null

    connect() {
        this.listingName = this.element.dataset['listingName']
        this.initSortable()
        this.currentOrder = this.getOrder()
        localStorage.setItem('order_' + this.listingName, JSON.stringify(this.currentOrder))
        this.initVisibilityToggling()
        this.saveVisibleColumnsList();

        document.addEventListener('turbo:before-frame-render', this.initOrderAndVisibility)
    }
    disconnect() {
        document.removeEventListener('turbo:before-frame-render', this.initOrderAndVisibility)
    }


    saveVisibleColumnsList() {
        let visibleCols = []
        for (const vcheck in this.visibilityChecks) {
            if (this.visibilityChecks[vcheck].checked === true)
                visibleCols.push(vcheck)
        }
        localStorage.setItem('visibility_' + this.listingName, JSON.stringify(visibleCols))
    }

    initSortable = () => {

        this.sortableList.addEventListener(
            "dragstart",
            (e) => {
                if (!e.target.getAttribute('draggable')) {
                    e.preventDefault()
                } else {
                    this.draggedItem = e.target;
                    setTimeout(() => {
                        e.target.style.display =
                            "none";
                    }, 0);
                }
            });

        this.sortableList.addEventListener(
            "dragend",
            this.dragendAction);

        this.sortableList.addEventListener(
            "dragover",
            (e) => {
                e.preventDefault();
                const afterElement =
                    getDragAfterElement(
                        this.sortableList,
                        e.clientY);

                if (afterElement == null) {
                    this.sortableList.appendChild(
                        this.draggedItem
                    );
                } else {
                    if (afterElement !== this.sortableList.firstElementChild) {
                        this.sortableList.insertBefore(
                            this.draggedItem,
                            afterElement
                        );
                    }
                }
            });

        const getDragAfterElement = (
            container, y
        ) => {
            const draggableElements = [
                ...container.querySelectorAll(
                    "div:not(.dragging)"
                ),];

            return draggableElements.reduce(
                (closest, child) => {
                    const box =
                        child.getBoundingClientRect();
                    const offset =
                        y - box.top - box.height / 2;
                    if (
                        offset < 0 &&
                        offset > closest.offset) {
                        return {
                            offset: offset,
                            element: child,
                        };
                    } else {
                        return closest;
                    }
                },
                {
                    offset: Number.NEGATIVE_INFINITY,
                }
            ).element;
        };

    }
    dragendAction = (e) => {
        e.target.style.display = "";

        const draggedId = this.draggedItem.getAttribute('data-id')
        const newOrder = this.getOrder()

        let fromIndex = this.currentOrder[draggedId]
        let toIndex = newOrder[draggedId]

        this.moveColumn(document.getElementById('items-listing-table'), fromIndex, toIndex)
        this.currentOrder = newOrder
        localStorage.setItem('order_' + this.listingName, JSON.stringify(this.currentOrder))
        this.draggedItem = null;
    }

    getOrder = () => {
        const newOrder = {};
        const items = this.sortableList.children;
        for (let i = 0; i < items.length; i++) {
            // skip first column because is the checkbox and is ignored
            newOrder[items[i].getAttribute('data-id')] = i+1;
        }
        return newOrder
    }

    moveColumn = (table, fromIndex, toIndex) => {
        if (!table || table.tagName !== 'TABLE') {
            return
        }
        if (fromIndex < toIndex) {
            toIndex++;
        }
        let rows = table.rows;

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            let cell = row.cells[fromIndex];
            row.insertBefore(cell, row.cells[toIndex]);
        }
    }

    initVisibilityToggling = () => {
        let checks = this.sortableList.querySelectorAll('input[type="checkbox"]');
        checks.forEach(input => {
            let id = input.getAttribute('data-id');
            this.visibilityChecks[id] = input;
            input.addEventListener('change', (event) => {
                this.toggleVisibility(
                    document.getElementById('items-listing-table'),
                    event.currentTarget.parentElement.getAttribute('data-id'),
                    event.currentTarget.checked
                );
            })
        });
    }

    toggleVisibility(table, columnId, checked) {
        if (!table || table.tagName !== 'TABLE') {
            return
        }
        const idx = this.currentOrder[columnId]

        let rows = Array.from(table.querySelectorAll('tr'));

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];

            let cells = Array.from(row.querySelectorAll('td, th'));
            if (!cells[idx]) {
                continue;
            }
            if (!checked) {
                cells[idx].classList.add('d-none');
            } else {
                cells[idx].classList.remove('d-none');
            }
        }
        this.saveVisibleColumnsList()
    }

    initOrderAndVisibility = async (event) => {

        const frame = event.detail.newFrame;
        let table = frame.querySelector('table');
        if (!table || table.tagName !== 'TABLE') {
            return;
        }

        event.stopPropagation();

        let serverOrder = {}
        let tHead = table.rows[0];

        for (let i = 0; i < tHead.cells.length; i++) {
            // only columns that are sortable are indexed in server order
            if (tHead.cells[i].hasAttribute('data-id')){
                serverOrder[tHead.cells[i].getAttribute('data-id')] = i
            }
        }
        let newTable = document.createElement('table')
        let thead = document.createElement('thead')
        let tbody = document.createElement('tbody')
        thead.classList.add('table-light')
        thead.classList.add('text-nowrap')
        thead.classList.add('small')

        table.querySelectorAll('tr').forEach((row) => {
            let newRow = document.createElement('tr')
            const cells = Array.from(row.querySelectorAll('td, th'));
            for (const column in this.currentOrder) {
                if (!(cells[serverOrder[column]])) {
                    continue;
                }
                newRow.append((cells[serverOrder[column]]).cloneNode(true))
            }
            //append actions column if present
            if (cells.length-1 === Object.keys(serverOrder).length) {
                newRow.append(row.lastElementChild)
            }
            newRow.classList.add(...row.classList)
            Array.from(row.attributes).forEach(attr => {
                newRow.setAttribute(attr.name, attr.value);
            });

            if (row.parentNode.tagName === 'TBODY') {
                tbody.appendChild(newRow)
            } else {
                thead.appendChild(newRow)
            }
        });
        newTable.appendChild(thead);
        newTable.appendChild(tbody);

        table.innerHTML = newTable.innerHTML

        for (const column in this.visibilityChecks) {
            this.toggleVisibility(table, column, this.visibilityChecks[column].checked)
        }
        event.detail.resume()
    }
}