import {Controller} from '@hotwired/stimulus'

export default class extends Controller {
    listingName = null
    connect() {
        this.listingName = this.element.dataset['listingName']
        this.element.addEventListener('click', this.download)
    }
    disconnect() {
        this.element.removeEventListener('click', this.download)
    }

    download = (event) => {
        event.stopPropagation();
        const itemsFrame = document.getElementById('items-list');
        let url = new URL( itemsFrame.getAttribute('src'), window.location.origin);
        let downloadUrl = new URL(this.element.dataset['href'], window.location.origin)

        downloadUrl.search = url.search

        const columnsOrder = JSON.parse(localStorage.getItem('order_' + this.listingName ))
        for (const column in columnsOrder) {
            downloadUrl.searchParams.set(`colOrder[${columnsOrder[column]}]`, column);
        }
        
        const columnsVisibility = JSON.parse(localStorage.getItem('visibility_' + this.listingName ))
        for (const column in columnsVisibility) {
            downloadUrl.searchParams.set(`colVisible[${column}]`, columnsVisibility[column]);
        }

        let downloadLink = document.createElement('a')
        downloadLink.setAttribute('download', true)
        downloadLink.setAttribute('data-turbo', false)
        downloadLink.setAttribute('href', downloadUrl.toString())
        downloadLink.click()
    }
}