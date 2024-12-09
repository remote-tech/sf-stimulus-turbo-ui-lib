import {Controller} from '@hotwired/stimulus'

export default class extends Controller {
    orgSelector = null

    connect() {
        this.orgSelector = $(this.element).closest('form').find('.orgParentOrganisation');
        $(this.element).on('change', this.showParentOptions);

        this.showParentOptions()
    }

    disconnect() {
        $(this.element).on('change', this.showParentOptions);
    }
    showParentOptions = (event) => {
        let id = $(this.element).find(':selected').data('default-parent-id')

        if (typeof id === "undefined") {
            this.orgSelector.find('option').each(function(key, elem) {
                    $(elem).attr('disabled', false);
            });
        } else {
            const selector = this.orgSelector

            this.orgSelector.find('option').each(function(key, elem) {
                if ($(elem).val() !== id.toString()) {
                    $(elem).attr('disabled', true);
                    $(elem).attr('selected', false)
                } else {
                    selector.val(id.toString())
                    $(elem).attr('disabled', false);
                    $(elem).attr('selected', true)
                }

                selector.trigger('change')
            });
        }
    }
}