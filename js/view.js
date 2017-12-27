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
var ViewScreen = (function () {
    function ViewScreen(title) {
        var _this = this;
        this.element = document.createElement("section");
        this.element.classList.add("screen", "view-screen");
        document.title = title + " - Analysis";
        this.$title = title;
        this.$lines = JSON.parse(localStorage.getItem("analysis-" + title));
        var lineNumbers = Object.keys(this.$lines);
        this.element.dir = this.$lines.dir;
        lineNumbers.forEach(function (lineNumber) { return !isNaN(parseInt(lineNumber)) && _this._createLine(_this.$lines[lineNumber], lineNumber); });
        self.addEventListener("beforeunload", function () {
            _this.save();
        });
    }
    ViewScreen.prototype._createLine = function (line, lineNumber) {
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
            lineElement: lineElement
        });
        var translationLine = document.createElement("div");
        translationLine.dir = "ltr";
        translationLine.lang = "de";
        translationLine.textContent = line.trans;
        translationLine.classList.add("line", "translation");
        translationLine.addEventListener("click", this._editTranslation.bind({
            line: line,
            translationLine: translationLine
        }));
        this.element.appendChild(translationLine);
    };
    ViewScreen.prototype._createWord = function (record) {
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
            record: record,
            origTd: origTd,
            analysisTd: analysisTd,
            transTd: transTd
        }));
    };
    ViewScreen.prototype._editWord = function () {
        var _this = this;
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
        dialog.onabort = function () { return dialog.hide(); };
        dialog.onsubmit = function (event, record) {
            _this.origTd.textContent = _this.record.orig = record[0].value;
            _this.record.analysis = record[1].value;
            _this.analysisTd.innerHTML = richtext(_this.record.analysis);
            _this.transTd.textContent = _this.record.trans = record[2].value;
            dialog.hide();
        };
        dialog.show();
    };
    ViewScreen.prototype._editTranslation = function () {
        var _this = this;
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
        dialog.onabort = function () { return dialog.hide(); };
        dialog.onsubmit = function (event, record) {
            _this.translationLine.textContent = _this.line.trans = record[0].value;
            dialog.hide();
        };
        dialog.show();
    };
    ViewScreen.prototype.save = function () {
        localStorage.setItem("analysis-" + this.$title, JSON.stringify(this.$lines));
    };
    return ViewScreen;
}());
try {
    var title = decodeURIComponent(location.search.replace("?title=", "").replace(/\+/g, " "));
    if (title && localStorage.getItem("analysis-" + title)) {
        var viewScreen = new ViewScreen(title);
        document.body.appendChild(viewScreen.element);
    }
    else {
        var dialog = new SelectDialog({
            title: "Please select a title to view",
            action: "view.html",
            method: "get",
            dataList: JSON.parse(localStorage.getItem("analysis-titles") || "[]"),
            abortButton: "Create new",
            submitButton: "View selected"
        });
        dialog.onabort = function (event) { return location.href = "create.html"; };
        dialog.show();
    }
}
catch (e) {
    console.error("Failed to load '" + title + "' from localStorage", e);
}
//# sourceMappingURL=view.js.map