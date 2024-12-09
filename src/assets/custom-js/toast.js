import {Toast} from "bootstrap";

export function showToast(type, message, title = 'Result', icon= null) {
    let toastElement = document.createElement('div');
    toastElement.className = ' toast bg-white rounded w-100';

    let toast = new Toast(toastElement, {
        autohide: true,
        delay: 500000
    });

    const toastBody = document.createElement('div');
    toastBody.classList.add('bg-opacity-10')
    toastBody.classList.add('toast-body')
    toastBody.classList.add('align-items-center')
    toastBody.classList.add('d-flex')

    const closeBtn = document.createElement('a')
    closeBtn.classList.add('text-muted')
    closeBtn.classList.add('mb-auto')
    closeBtn.classList.add('ms-auto')
    closeBtn.setAttribute('data-bs-dismiss', 'toast')
    closeBtn.setAttribute('aria-label', 'Close')
    closeBtn.innerHTML = '<i class="bi bi-x-lg"></i>'

    const iconElem = document.createElement('i');
    iconElem.classList.add('bi')
    iconElem.classList.add('fs-2')
    iconElem.classList.add('square-44')

    const textContainer = document.createElement('div');
    textContainer.innerHTML =
        '<p class="fw-bold mb-0">' + title + '</p>' +
        '<p class="text-muted mb-0">' + message + '</p>'

    if (type === 'success') {
        toastBody.classList.add('bg-success')

        toastBody.classList.add('text-success')
        iconElem.classList.add('bi-check')
        if (null !== icon) {
            iconElem.classList.add(icon)
        }
    } else {
        toastBody.classList.add('bg-danger')
        // toastBody.classList.add('d-flex')
        toastBody.classList.add('text-danger')

        iconElem.classList.add('bi-exclamation')
        if (null !== icon) {
            iconElem.classList.add(icon)
        }
    }

    toastBody.appendChild(iconElem);
    toastBody.appendChild(textContainer);
    toastBody.appendChild(closeBtn);


    let parentContainer = document.querySelector('.parent-container');


    if (parentContainer === null) {
        parentContainer = document.createElement('div');
        parentContainer.setAttribute('aria-live', 'polite')
        parentContainer.setAttribute('aria-atomic', 'true')
        parentContainer.className = 'parent-container d-flex justify-content-center align-items-center'

        let toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed end-0 top-0 p-3'; //justify-content-lg-end

        parentContainer.appendChild(toastContainer)
        document.querySelector('body').prepend(parentContainer);

    }
    let toastContainer = parentContainer.querySelector('.toast-container');

    toast._element.appendChild(toastBody);
    toastContainer.appendChild(toastElement)

    toast.show();
}