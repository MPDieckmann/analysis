class Dialog {
    constructor(options = {}) {
        // #region initialize components
        // initialize element
        this.element = document.createElement(options.contentElement || "div");
        this.element.classList.add("dialog");
        // initialize header
        this.$header = document.createElement("header");
        this.$header.classList.add("header");
        this.$header.textContent = "title" in options ? options.title : "";
        this.element.appendChild(this.$header);
        // initialize content
        this.$content = document.createElement("div");
        this.$content.classList.add("content");
        this.element.appendChild(this.$content);
        // initialize header
        // #endregion
    }
    hide() {
        this.element.parentElement && this.element.parentElement.removeChild(this.element);
    }
    show() {
        document.body.appendChild(this.element);
    }
}
class SelectDialog extends Dialog {
    constructor(options) {
        super(Object.assign(options, {
            contentElement: "form"
        }));
        this.$onabort = null;
        this.$onsubmit = null;
        this.element.classList.add("select-dialog");
        this.element.action = options.action;
        this.element.method = options.method;
        this.element.addEventListener("submit", event => {
            if (typeof this.onsubmit === "function") {
                this.onsubmit(event, active.value);
            }
        });
        var hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = "title";
        hidden.value = null;
        this.$content.appendChild(hidden);
        var active = null;
        options.dataList.forEach(data => {
            if (typeof data == "string") {
                data = {
                    label: data,
                    data: data
                };
            }
            var label = data.label;
            var value = data.data;
            var option = document.createElement("div");
            option.classList.add("radio-button");
            option.textContent = label;
            option.value = value;
            option.addEventListener("click", () => {
                if (active) {
                    active.classList.remove("active");
                }
                option.classList.add("active");
                active = option;
                hidden.value = value.toString();
                submitButton.disabled = false;
            });
            this.$content.appendChild(option);
        });
        this.$footer = document.createElement("footer");
        this.$footer.classList.add("footer");
        this.element.appendChild(this.$footer);
        var abortButton = document.createElement("input");
        abortButton.type = "button";
        abortButton.value = options.abortButton;
        abortButton.addEventListener("click", event => {
            if (typeof this.onabort === "function") {
                this.onabort(event);
            }
        });
        abortButton.classList.add("abort");
        this.$footer.appendChild(abortButton);
        var submitButton = document.createElement("input");
        submitButton.type = "submit";
        submitButton.value = options.submitButton;
        submitButton.disabled = true;
        this.$footer.appendChild(submitButton);
    }
    get onabort() {
        return this.$onabort;
    }
    set onabort(value) {
        this.$onabort = value;
    }
    get onsubmit() {
        return this.$onsubmit;
    }
    set onsubmit(value) {
        this.$onsubmit = value;
    }
}
class EditDialog extends Dialog {
    constructor(options) {
        super(Object.assign(options, {
            title: "Edit record",
            contentElement: "form"
        }));
        this.$onabort = null;
        this.$onsubmit = null;
        this.$dataset = options.record;
        this.element.action = options.action;
        this.element.method = options.method;
        this.element.classList.add("edit-dialog");
        this.element.addEventListener("submit", event => {
            this.$controls.forEach((control, index) => {
                this.$dataset[index].value = control.value;
            });
            if (typeof this.onsubmit == "function") {
                this.onsubmit(event, this.$dataset);
            }
            event.preventDefault();
        });
        this.$controls = [];
        this.$dataset.forEach(data => {
            var label = document.createElement("label");
            this.$content.appendChild(label);
            var div = document.createElement("div");
            div.textContent = data.label;
            label.appendChild(div);
            var control;
            switch (data.type) {
                case "textline":
                    control = document.createElement("input");
                    control.setAttribute("value", data.value);
                    break;
                case "textarea":
                    control = document.createElement("textarea");
                    control.textContent = data.value;
                    break;
                default:
                    return;
            }
            control.lang = data.lang;
            control.dir = data.dir;
            this.$controls.push(control);
            label.appendChild(control);
        });
        this.$footer = document.createElement("footer");
        this.$footer.classList.add("footer");
        this.element.appendChild(this.$footer);
        var resetButton = document.createElement("input");
        resetButton.type = "reset";
        resetButton.value = "Discard changes";
        resetButton.addEventListener("click", () => {
            if (typeof this.onabort == "function") {
                this.onabort(event);
            }
        });
        this.$footer.appendChild(resetButton);
        var submitButton = document.createElement("input");
        submitButton.type = "submit";
        submitButton.value = "Save changes";
        this.$footer.appendChild(submitButton);
    }
    get onabort() {
        return this.$onabort;
    }
    set onabort(value) {
        this.$onabort = value;
    }
    get onsubmit() {
        return this.$onsubmit;
    }
    set onsubmit(value) {
        this.$onsubmit = value;
    }
}
//# sourceMappingURL=edit.js.map