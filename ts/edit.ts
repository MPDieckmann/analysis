interface DialogOptions<C extends keyof HTMLElementTagNameMap = "div"> {
  title?: string;
  contentElement?: C;
}

class Dialog<C extends keyof HTMLElementTagNameMap = "div"> {
  public element: HTMLElementTagNameMap[C];

  protected $header: HTMLElement;
  protected $content: HTMLElement;

  protected constructor(options: DialogOptions<C> = {}) {
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

  public hide() {
    this.element.parentElement && this.element.parentElement.removeChild(this.element);
  }
  public show() {
    document.body.appendChild(this.element);
  }
}


interface SelectDialogOptions extends DialogOptions<"form"> {
  action: string;
  method: string;
  dataList: (string | { label: string, data: any })[];
  abortButton: string;
  submitButton: string;
}

class SelectDialog extends Dialog<"form"> {
  protected $footer: HTMLElement;

  constructor(options: SelectDialogOptions) {
    super(Object.assign(options, {
      contentElement: "form"
    }));

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

    var active: HTMLDivElement & { value?: any } = null;
    options.dataList.forEach(data => {
      if (typeof data == "string") {
        data = {
          label: data,
          data: data
        };
      }
      var label: string = data.label;
      var value: any = data.data;
      var option: HTMLDivElement & { value?: any } = document.createElement("div");
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

  protected $onabort: (event: Event) => void = null;
  public get onabort(): (event: Event) => void {
    return this.$onabort;
  }
  public set onabort(value: (event: Event) => void) {
    this.$onabort = value;
  }

  protected $onsubmit: (event: Event, active: any) => void = null;
  public get onsubmit(): (event: Event, active: any) => void {
    return this.$onsubmit;
  }
  public set onsubmit(value: (event: Event, active: any) => void) {
    this.$onsubmit = value;
  }
}

type EditDialogRecord = {
  type: "textline" | "textarea",
  label: string;
  value: string;
  lang: string;
  dir: "ltr" | "rtl";
}[];

interface EditDialogOptions extends DialogOptions<"form"> {
  record: EditDialogRecord,
  action: string;
  method: string;
}

class EditDialog extends Dialog<"form"> {
  protected $footer: HTMLElement;
  protected $dataset: EditDialogRecord;
  protected $controls: (HTMLTextAreaElement | HTMLInputElement)[];

  constructor(options: EditDialogOptions) {
    super(Object.assign(options, {
      title: "Edit record",
      contentElement: "form"
    }));

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

      var control: HTMLTextAreaElement | HTMLInputElement;
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

  protected $onabort: (event: Event) => void = null;
  public get onabort(): (event: Event) => void {
    return this.$onabort;
  }
  public set onabort(value: (event: Event) => void) {
    this.$onabort = value;
  }

  protected $onsubmit: (event: Event, record: EditDialogRecord) => void = null;
  public get onsubmit(): (event: Event, record: EditDialogRecord) => void {
    return this.$onsubmit;
  }
  public set onsubmit(value: (event: Event, record: EditDialogRecord) => void) {
    this.$onsubmit = value;
  }
}
