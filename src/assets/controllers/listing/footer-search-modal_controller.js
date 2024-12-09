import {Controller} from '@hotwired/stimulus'
import {Modal} from 'bootstrap';

export default class extends Controller {

    search = (event) => {
        event.stopPropagation()
        const searchValue = $(this.element).find('input[name="searchTerm"]').val()
        const $elem = $('#listSearch');
        $elem.val(searchValue);
        $elem.focus();


        var enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            keyCode: 13,
            code: 'Enter',
            which: 13,
            bubbles: true
        });

        this.hideModal()

        // dispatch the event on the js item
        $elem[0].dispatchEvent(enterEvent);

    }

    reset = (event) => {
       const clearSearch = document.getElementById('clearSearch');
        $(clearSearch).click();
        this.hideModal()
    }

    hideModal = () => {
        // find modal by id
        const myModal = Modal.getInstance(document.getElementById('searchModal'));
        myModal.hide();
    }
}