var ViewScreen = (function () {
    function ViewScreen(title) {
        var _this = this;
        this.element = document.createElement("table");
        this.element.classList.add("screen", "view-screen");
        document.title = title + "- Analysis";
        this.$title = title;
        this.$lines = JSON.parse(localStorage.getItem("analysis-" + title));
        var lineNumbers = Object.keys(this.$lines);
        var length = 0;
        this.element.dir = this.$lines.dir;
        lineNumbers.forEach(function (lineNumber) {
            if (!isNaN(parseInt(lineNumber)) && _this.$lines[lineNumber].orig.length > length) {
                length = _this.$lines[lineNumber].orig.length;
            }
        });
        lineNumbers.forEach(function (lineNumber) { return !isNaN(parseInt(lineNumber)) && _this._createLine(_this.$lines[lineNumber], lineNumber, length, _this.$lines); });
        self.addEventListener("beforeunload", function () {
            _this.save();
        });
    }
    ViewScreen.prototype._createLine = function (line, lineNumber, length, lines) {
        var origLine = document.createElement("tr");
        origLine.classList.add("orig");
        this.element.appendChild(origLine);
        var analysisLine = document.createElement("tr");
        this.element.appendChild(analysisLine);
        var transLine = document.createElement("tr");
        this.element.appendChild(transLine);
        var translationLine = document.createElement("tr");
        translationLine.classList.add("trans");
        this.element.appendChild(translationLine);
        var lineNumberTd = document.createElement("td");
        lineNumberTd.classList.add("line-number");
        lineNumberTd.dir = "ltr";
        lineNumberTd.lang = "de";
        lineNumberTd.rowSpan = 4;
        lineNumberTd.textContent = lineNumber;
        origLine.appendChild(lineNumberTd);
        var lineLength = line.orig.length;
        var index = -1;
        while (++index < length) {
            createWord(index);
        }
        var translationCell = document.createElement("td");
        translationCell.dir = "ltr";
        translationCell.lang = "de";
        translationCell.classList.add("trans");
        translationCell.textContent = line.trans;
        translationCell.colSpan = length;
        translationCell.addEventListener("click", function () {
            var dialog = new EditDialog({
                action: location.href,
                method: "get",
                record: [{
                        type: "textarea",
                        label: "Translation",
                        lang: "de",
                        dir: "ltr",
                        value: line.trans
                    }]
            });
            dialog.onabort = function () { return dialog.hide(); };
            dialog.onsubmit = function (event, record) {
                translationCell.textContent = line.trans = record[0].value;
                dialog.hide();
            };
            dialog.show();
        });
        translationLine.appendChild(translationCell);
        function createWord(index) {
            var origTd = document.createElement("td");
            origTd.classList.add(lines.lang);
            origTd.dir = lines.dir;
            origTd.lang = lines.lang;
            origLine.appendChild(origTd);
            var analysisTd = document.createElement("td");
            analysisTd.classList.add("analysis");
            analysisTd.dir = "ltr";
            analysisTd.lang = "de";
            analysisLine.appendChild(analysisTd);
            var transTd = document.createElement("td");
            transTd.classList.add("trans");
            transTd.dir = "ltr";
            transTd.lang = "de";
            transLine.appendChild(transTd);
            if (index < lineLength) {
                var rec = line.orig[index];
                origTd.textContent = rec.orig;
                origTd.addEventListener("click", editWord.bind(null, {
                    rec: rec,
                    origTd: origTd,
                    analysisTd: analysisTd,
                    transTd: transTd
                }));
                analysisTd.textContent = rec.analysis;
                analysisTd.addEventListener("click", editWord.bind(null, {
                    rec: rec,
                    origTd: origTd,
                    analysisTd: analysisTd,
                    transTd: transTd
                }));
                transTd.textContent = rec.trans;
                transTd.addEventListener("click", editWord.bind(null, {
                    rec: rec,
                    origTd: origTd,
                    analysisTd: analysisTd,
                    transTd: transTd
                }));
            }
        }
        function editWord(_a) {
            var rec = _a.rec, origTd = _a.origTd, analysisTd = _a.analysisTd, transTd = _a.transTd;
            var dialog = new EditDialog({
                action: location.href,
                method: "get",
                record: [{
                        type: "textline",
                        label: "Original word",
                        lang: lines.lang,
                        dir: lines.dir,
                        value: rec.orig
                    }, {
                        type: "textarea",
                        label: "Analysis",
                        lang: "de",
                        dir: "ltr",
                        value: rec.analysis
                    }, {
                        type: "textline",
                        label: "Translations",
                        lang: "de",
                        dir: "ltr",
                        value: rec.trans
                    }]
            });
            dialog.onabort = function () { return dialog.hide(); };
            dialog.onsubmit = function (event, record) {
                origTd.textContent = rec.orig = record[0].value;
                analysisTd.textContent = rec.analysis = record[1].value;
                transTd.textContent = rec.trans = record[2].value;
                dialog.hide();
            };
            dialog.show();
        }
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
//# sourceMappingURL=view.table.js.map