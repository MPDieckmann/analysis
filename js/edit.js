var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Dialog = (function () {
    function Dialog(options) {
        if (options === void 0) { options = {}; }
        this.element = document.createElement(options.contentElement || "div");
        this.element.classList.add("dialog");
        this.$header = document.createElement("header");
        this.$header.classList.add("header");
        this.$header.textContent = "title" in options ? options.title : "";
        this.element.appendChild(this.$header);
        this.$content = document.createElement("div");
        this.$content.classList.add("content");
        this.element.appendChild(this.$content);
    }
    Dialog.prototype.hide = function () {
        this.element.parentElement && this.element.parentElement.removeChild(this.element);
    };
    Dialog.prototype.show = function () {
        document.body.appendChild(this.element);
    };
    return Dialog;
}());
var SelectDialog = (function (_super) {
    __extends(SelectDialog, _super);
    function SelectDialog(options) {
        var _this = _super.call(this, Object.assign(options, {
            contentElement: "form"
        })) || this;
        _this.$onabort = null;
        _this.$onsubmit = null;
        _this.element.classList.add("select-dialog");
        _this.element.action = options.action;
        _this.element.method = options.method;
        _this.element.addEventListener("submit", function (event) {
            if (typeof _this.onsubmit === "function") {
                _this.onsubmit(event, active.value);
            }
        });
        var hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = "title";
        hidden.value = null;
        _this.$content.appendChild(hidden);
        var active = null;
        options.dataList.forEach(function (data) {
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
            option.addEventListener("click", function () {
                if (active) {
                    active.classList.remove("active");
                }
                option.classList.add("active");
                active = option;
                hidden.value = value.toString();
                submitButton.disabled = false;
            });
            _this.$content.appendChild(option);
        });
        _this.$footer = document.createElement("footer");
        _this.$footer.classList.add("footer");
        _this.element.appendChild(_this.$footer);
        var abortButton = document.createElement("input");
        abortButton.type = "button";
        abortButton.value = options.abortButton;
        abortButton.addEventListener("click", function (event) {
            if (typeof _this.onabort === "function") {
                _this.onabort(event);
            }
        });
        abortButton.classList.add("abort");
        _this.$footer.appendChild(abortButton);
        var submitButton = document.createElement("input");
        submitButton.type = "submit";
        submitButton.value = options.submitButton;
        submitButton.disabled = true;
        _this.$footer.appendChild(submitButton);
        return _this;
    }
    Object.defineProperty(SelectDialog.prototype, "onabort", {
        get: function () {
            return this.$onabort;
        },
        set: function (value) {
            this.$onabort = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectDialog.prototype, "onsubmit", {
        get: function () {
            return this.$onsubmit;
        },
        set: function (value) {
            this.$onsubmit = value;
        },
        enumerable: true,
        configurable: true
    });
    return SelectDialog;
}(Dialog));
var EditDialog = (function (_super) {
    __extends(EditDialog, _super);
    function EditDialog(options) {
        var _this = _super.call(this, Object.assign(options, {
            title: "Edit record",
            contentElement: "form"
        })) || this;
        _this.$onabort = null;
        _this.$onsubmit = null;
        _this.$dataset = options.record;
        _this.element.action = options.action;
        _this.element.method = options.method;
        _this.element.classList.add("edit-dialog");
        _this.element.addEventListener("submit", function (event) {
            _this.$controls.forEach(function (control, index) {
                _this.$dataset[index].value = control.value;
            });
            if (typeof _this.onsubmit == "function") {
                _this.onsubmit(event, _this.$dataset);
            }
            event.preventDefault();
        });
        _this.$controls = [];
        _this.$dataset.forEach(function (data) {
            var label = document.createElement("label");
            _this.$content.appendChild(label);
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
            _this.$controls.push(control);
            label.appendChild(control);
        });
        _this.$footer = document.createElement("footer");
        _this.$footer.classList.add("footer");
        _this.element.appendChild(_this.$footer);
        var resetButton = document.createElement("input");
        resetButton.type = "reset";
        resetButton.value = "Discard changes";
        resetButton.addEventListener("click", function () {
            if (typeof _this.onabort == "function") {
                _this.onabort(event);
            }
        });
        _this.$footer.appendChild(resetButton);
        var submitButton = document.createElement("input");
        submitButton.type = "submit";
        submitButton.value = "Save changes";
        _this.$footer.appendChild(submitButton);
        return _this;
    }
    Object.defineProperty(EditDialog.prototype, "onabort", {
        get: function () {
            return this.$onabort;
        },
        set: function (value) {
            this.$onabort = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditDialog.prototype, "onsubmit", {
        get: function () {
            return this.$onsubmit;
        },
        set: function (value) {
            this.$onsubmit = value;
        },
        enumerable: true,
        configurable: true
    });
    return EditDialog;
}(Dialog));
//# sourceMappingURL=edit.js.map