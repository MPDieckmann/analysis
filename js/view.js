/// <reference path="../ts/interfaces.d.ts" />
/// <reference path="../ts/edit.ts" />
function htmlescapespe(input) {
    return input.replace(/\&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
}
function richtext(input) {
    return (htmlescapespe(input)
        .replace(/\n?\-\-\-\n?/g, "<hr/>")
        .replace(/\n?\=\=\=\n?/g, '<hr class="double"/>')
        .replace(/\^\(([^\)]+)\)/g, "<sup>$1</sup>")
        .replace(/\^(.)/g, "<sup>$1</sup>")
        .replace(/\*\*\(([^\)]+)\)/g, "<i>$1</i>")
        .replace(/\*\(([^\)]+)\)/g, "<b>$1</b>")
        .replace(/\n/g, "<br/>"));
}
class ViewScreen {
    constructor(title) {
        // #region initialize components
        // initialize element
        this.element = document.createElement("section");
        this.element.classList.add("screen", "view-screen");
        // #endregion
        document.title = title + " - Analysis";
        this.$title = title;
        this.$lines = JSON.parse(localStorage.getItem("analysis-" + title));
        var lineNumbers = Object.keys(this.$lines);
        this.element.dir = this.$lines.dir;
        lineNumbers.forEach(lineNumber => !isNaN(parseInt(lineNumber)) && this._createLine(this.$lines[lineNumber], lineNumber));
        self.addEventListener("beforeunload", () => {
            this.save();
        });
    }
    _createLine(line, lineNumber) {
        var lineElement = document.createElement("div");
        lineElement.classList.add("line", "analysis");
        this.element.appendChild(lineElement);
        var lineNumberTd = document.createElement("div");
        lineNumberTd.classList.add("cell", "line-number");
        lineNumberTd.dir = "ltr";
        lineNumberTd.lang = "de";
        lineNumberTd.textContent = lineNumber;
        lineElement.appendChild(lineNumberTd);
        var lineLength = line.orig.length;
        var index = -1;
        line.orig.forEach(this._createWord, {
            editWord: this._editWord,
            lines: this.$lines,
            lineElement
        });
        var translationLine = document.createElement("div");
        translationLine.dir = "ltr";
        translationLine.lang = "de";
        translationLine.textContent = line.trans;
        translationLine.classList.add("line", "translation");
        translationLine.addEventListener("click", this._editTranslation.bind({
            line,
            translationLine
        }));
        this.element.appendChild(translationLine);
    }
    _createWord(record) {
        var cell = document.createElement("div");
        cell.classList.add("cell");
        this.lineElement.appendChild(cell);
        var origTd = document.createElement("div");
        origTd.classList.add("orig", this.lines.lang);
        origTd.dir = this.lines.dir;
        origTd.lang = this.lines.lang;
        origTd.textContent = record.orig;
        cell.appendChild(origTd);
        var analysisTd = document.createElement("div");
        analysisTd.classList.add("analysis");
        analysisTd.dir = "ltr";
        analysisTd.lang = "de";
        analysisTd.innerHTML = richtext(record.analysis);
        cell.appendChild(analysisTd);
        var transTd = document.createElement("div");
        transTd.classList.add("trans");
        transTd.dir = "ltr";
        transTd.lang = "de";
        transTd.textContent = record.trans;
        cell.appendChild(transTd);
        cell.addEventListener("click", this.editWord.bind({
            lines: this.lines,
            record,
            origTd,
            analysisTd,
            transTd
        }));
    }
    _editWord() {
        var dialog = new EditDialog({
            action: location.href,
            method: "get",
            record: [{
                    type: "textline",
                    label: "Original word",
                    lang: this.lines.lang,
                    dir: this.lines.dir,
                    value: this.record.orig
                }, {
                    type: "textarea",
                    label: "Analysis",
                    lang: "de",
                    dir: "ltr",
                    value: this.record.analysis
                }, {
                    type: "textline",
                    label: "Translations",
                    lang: "de",
                    dir: "ltr",
                    value: this.record.trans
                }]
        });
        dialog.onabort = () => dialog.hide();
        dialog.onsubmit = (event, record) => {
            this.origTd.textContent = this.record.orig = record[0].value;
            this.record.analysis = record[1].value;
            this.analysisTd.innerHTML = richtext(this.record.analysis);
            this.transTd.textContent = this.record.trans = record[2].value;
            dialog.hide();
        };
        dialog.show();
    }
    _editTranslation() {
        var dialog = new EditDialog({
            action: location.href,
            method: "get",
            record: [{
                    type: "textarea",
                    label: "Translation",
                    lang: "de",
                    dir: "ltr",
                    value: this.line.trans
                }]
        });
        dialog.onabort = () => dialog.hide();
        dialog.onsubmit = (event, record) => {
            this.translationLine.textContent = this.line.trans = record[0].value;
            dialog.hide();
        };
        dialog.show();
    }
    save() {
        localStorage.setItem("analysis-" + this.$title, JSON.stringify(this.$lines));
    }
}
try {
    var title = decodeURIComponent(location.search.replace("?title=", "").replace(/\+/g, " "));
    if (title && localStorage.getItem("analysis-" + title)) {
        var viewScreen = new ViewScreen(title);
        document.body.appendChild(viewScreen.element);
    }
    else {
        var dialog = new SelectDialog({
            title: "Please select a title to view",
            action: location.href,
            method: "get",
            dataList: JSON.parse(localStorage.getItem("analysis-titles") || "[]"),
            abortButton: "Create new",
            submitButton: "View selected"
        });
        dialog.onabort = event => location.href = "create.html";
        dialog.show();
    }
}
catch (e) {
    console.error("Failed to load '" + title + "' from localStorage", e);
}
//# sourceMappingURL=view.js.map