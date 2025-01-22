import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
    static targets = ["input", "preview"];

    connect() {
        this.preview = this.element.querySelector("#image-preview");
        this.input = this.element.querySelector("input[type='file']");

        this.preview.addEventListener("click", () => this.input.click());
        this.input.addEventListener("change", this.updatePreview.bind(this));
    }

    updatePreview(event) {
        const file = event.target.files[0];
        if (file) {
            const img = document.createElement('img')
            img.width = 200;
            img.height = 200;
            img.style.objectFit = 'cover';
            img.role = 'button'
            this.preview.innerHTML = '';
            this.preview.appendChild(img)
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }
}