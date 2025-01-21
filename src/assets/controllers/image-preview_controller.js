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
            const reader = new FileReader();
            reader.onload = (e) => {
                this.preview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }
}