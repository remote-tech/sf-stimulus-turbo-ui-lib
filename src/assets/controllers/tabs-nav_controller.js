import {Controller} from '@hotwired/stimulus'

export default class extends Controller {
    connect() {
        const currentHashId = window.location.hash.substring(1);
        let target = document.getElementById(currentHashId);
        if (null === target) {
            target = this.element.querySelectorAll('a')[0];
        }
        this.highlightTab(target)
        this.element.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', this.handleClick);
        });
    }

    disconnect() {
        this.element.querySelectorAll('a').forEach(link => {
            link.removeEventListener('click', this.handleClick);
        });
    }

    handleClick = (event) => {
        event.stopPropagation()
        const target = event.target;
        if (target.tagName === 'A') {
            const hash = target.getAttribute('id');

            const url = new URL(window.location.href)

            window.history.replaceState(null, null,  url.origin + url.pathname + '#' + hash);
        }

        let frame = document.getElementById('tabs-content')
        frame.src = target.dataset['href']

        this.highlightTab(event.target);
    }

    highlightTab = (selectedTarget) => {
        this.element.querySelectorAll('a').forEach(link => {
            link.classList.remove('active');
            link.classList.remove('text-muted');
        });

        selectedTarget.classList.add('active');

        this.element.querySelectorAll('a').forEach(link => {
            if (link !== selectedTarget) {
                link.classList.add('text-muted');
            }
        });
    }
}