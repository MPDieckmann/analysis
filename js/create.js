/// <reference path="../ts/interfaces.d.ts" />
class CreateScreen {
    constructor(options = {}) {
        // #region initialize components
        // initialize options
        this.$options = Object.assign({
            title: "",
            text: ""
        }, options);
        // initialize element
        this.element = document.createElement("form");
        this.element.classList.add("screen", "create-screen");
        this.element.action = "index.html";
        this.element.method = "get";
        this.element.addEventListener("submit", () => {
            this.$create();
        });
        // initialize titleInput
        this.$titleInput = document.createElement("input");
        this.$titleInput.name = "title";
        this.$titleInput.placeholder = "Titel";
        this.$titleInput.type = "text";
        this.$titleInput.classList.add("title");
        this.$titleInput.value = this.$options.title;
        this.element.appendChild(this.$titleInput);
        // initialize textInput
        this.$textInput = document.createElement("textarea");
        this.$textInput.placeholder = "Text";
        this.$textInput.classList.add("text");
        this.$textInput.value = this.$options.text;
        this.element.appendChild(this.$textInput);
        // initialize buttonGroup
        var buttonGroup = document.createElement("div");
        buttonGroup.classList.add("button-group");
        this.element.appendChild(buttonGroup);
        // initialize langSelect
        this.$langSelect = document.createElement("select");
        buttonGroup.appendChild(this.$langSelect);
        var hboOption = document.createElement("option");
        hboOption.textContent = "Ancient Hebrew";
        hboOption.value = "hbo";
        this.$langSelect.add(hboOption);
        var grcOption = document.createElement("option");
        grcOption.textContent = "Ancient Greek";
        grcOption.value = "grc";
        this.$langSelect.add(grcOption);
        var deOption = document.createElement("option");
        deOption.textContent = "German";
        deOption.value = "de";
        this.$langSelect.add(deOption);
        // initialize resetButton
        var resetButton = document.createElement("input");
        resetButton.type = "reset";
        resetButton.classList.add("reset-button");
        resetButton.value = "Reset";
        resetButton.addEventListener("click", event => {
            event.preventDefault();
            if (confirm("Do you wish to reset all fields?")) {
                this.$reset();
            }
        });
        buttonGroup.appendChild(resetButton);
        // initialize createButton
        var createButton = document.createElement("input");
        createButton.type = "submit";
        createButton.classList.add("create-button");
        createButton.value = "Create";
        buttonGroup.appendChild(createButton);
        // #endregion
        self.addEventListener("beforeunload", event => {
            try {
                this.save();
            }
            catch (e) {
                console.error("Failed to save changes:", e);
                event.returnValue = "Changes will be lost!\n\nSee console for more details";
                event.preventDefault();
            }
        });
    }
    $reset() {
        // reset titleInput
        this.$titleInput.value = "";
        // reset textInput
        this.$textInput.value = "";
    }
    _getTitle() {
        return this.$titleInput.value;
    }
    _getLine(entry) {
        var line = {
            orig: [],
            trans: ""
        };
        entry.trim().replace(/ /g, "\t")
            .replace(/\u05be/g, "\u05be\t")
            .replace(/\t\u05c0/g, " \u05c0")
            .split("\t").forEach(entry => {
            line.orig.push({
                orig: entry,
                analysis: "",
                trans: ""
            });
        });
        return line;
    }
    _getText() {
        var text = {
            dir: this.$langSelect.value == "hbo" ? "rtl" : "ltr",
            lang: this.$langSelect.value
        };
        var input = this.$textInput.value.split(/([0-9]+)/);
        input.forEach((entry, index) => {
            entry = entry.trim();
            if (index % 2 == 0 && entry !== "") {
                text[index > 0 ? parseInt(input[index - 1]) : 0] = this._getLine(entry);
            }
        });
        return text;
    }
    $create() {
        try {
            var title = this._getTitle();
            var titles = JSON.parse(localStorage.getItem("analysis-titles") || "[]");
            if (titles.indexOf(title) >= 0) {
                if (!confirm("Do you wish to overwrite the existing entry for '" + title + "'?")) {
                    this.save();
                    alert("Aborted!");
                    return;
                }
                titles.splice(title.indexOf(title), 1);
            }
            titles.push(title);
            localStorage.setItem("analysis-titles", JSON.stringify(titles));
            var text = this._getText();
            localStorage.setItem("analysis-" + title, JSON.stringify(text));
        }
        catch (e) {
            console.error(e);
            alert("Something went wrong :/\n\nSee console for more details");
        }
    }
    save() {
        localStorage.setItem("tmp-analysis-title", this.$titleInput.value);
        localStorage.setItem("tmp-analysis-text", this.$textInput.value);
    }
}
var options = {};
try {
    options.title = localStorage.getItem("tmp-analysis-title");
    options.text = localStorage.getItem("tmp-analysis-text");
}
catch (e) {
    console.error("Failed to load tmp-analysis from localStorage", e);
}
var createScreen = new CreateScreen(options);
document.body.appendChild(createScreen.element);
//# sourceMappingURL=create.js.map