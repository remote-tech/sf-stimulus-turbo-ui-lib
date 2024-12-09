import {Controller} from '@hotwired/stimulus'

export default class extends Controller {
    cookieName = 'sidebar_min';

    connect() {
        this.element.addEventListener('click', this.toggleSidebar);
    }

    disconnect() {
        this.element.removeEventListener('click', this.toggleSidebar);
    }

    getCookie = (cookieName) => {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(cookieName + '=')) {
                return cookie.substring(cookieName.length + 1);
            }
        }
        return null;
    }

    toggleSidebar = (event) => {
        $('.sidebar-toggle').toggleClass('d-none').toggleClass('d-lg-flex')

        let cookieVal = this.getCookie(this.cookieName);
        if (cookieVal === null) {
            cookieVal = false;
        } else {
            cookieVal = cookieVal.toLowerCase() === "true"
        }

        var date = new Date();
        date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
        const expires = "; expires=" + date.toUTCString();
        document.cookie = this.cookieName + "=" + (!cookieVal) + expires + "; SameSite=Lax; path=/";
    }
}