import {Controller} from '@hotwired/stimulus'

export default class extends Controller {
    static values = {
        text: String
    }
    connect() {
        this.element.addEventListener('click', this.copy);
    }

    disconnect() {
        this.element.removeEventListener('click', this.copy);
    }


    copy = (event) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(this.textValue).then(() => {
                console.log('copied to navigator');
            }).catch(err => {
                console.error('Failed to copy to navigator: ', err);
            });
        } else {
            this.fallbackCopyTextToClipboard(this.textValue);
        }
    }

    fallbackCopyTextToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.style.top = "0";
        textarea.style.left = "0";
        textarea.style.position = "fixed";

        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();

        try {
            document.execCommand('copy');
           console.log('Copied to clipboard!');
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }
        document.body.removeChild(textarea);
    }
}