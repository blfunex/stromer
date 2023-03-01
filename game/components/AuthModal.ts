import Modal from "../core/Modal";
import ToggleButton from "../core/ToggleButton";

export default class AuthModal extends Modal {
  constructor() {
    super();
    this.markup();
    this.events();
    this.update();
  }

  private mode: "login" | "signup" = "login";
  private header = document.createElement("h1");
  private form = document.createElement("form");
  private email = document.createElement("input");
  private password = document.createElement("input");
  private passwordRepeat = document.createElement("input");
  private emailLabel = document.createElement("label");
  private passwordLabel = document.createElement("label");
  private passwordRepeatLabel = document.createElement("label");
  private submit = document.createElement("button");
  private tabs = document.createElement("menu");
  private loginTab = new ToggleButton("Login");
  private signupTab = new ToggleButton("Sign up");
  private closeBtn = document.createElement("button");
  private title = document.createElement("span");

  private markup() {
    this.element.appendChild(this.header);
    this.classes.add("auth-modal");
    this.header.appendChild(this.title);
    this.title.textContent = "Login";
    this.header.appendChild(this.closeBtn);
    this.closeBtn.textContent = "×";
    this.element.appendChild(this.form);

    this.form.appendChild(this.emailLabel);
    this.email.type = "email";
    this.email.placeholder = "Email";
    let label = document.createElement("span");
    label.textContent = "Email";
    this.emailLabel.appendChild(label);
    this.emailLabel.appendChild(this.email);

    this.form.appendChild(this.passwordLabel);
    this.password.type = "password";
    this.password.placeholder = "Password";
    label = document.createElement("span");
    label.textContent = "Password";
    this.passwordLabel.appendChild(label);
    this.passwordLabel.appendChild(this.password);

    this.form.appendChild(this.passwordRepeatLabel);
    this.passwordRepeat.type = "password";
    this.passwordRepeat.placeholder = "Repeat password";
    label = document.createElement("span");
    label.textContent = "Repeat password";
    this.passwordRepeatLabel.appendChild(label);
    this.passwordRepeatLabel.appendChild(this.passwordRepeat);

    this.form.appendChild(this.submit);
    this.submit.textContent = "Sign in";
    this.submit.type = "submit";
    this.element.appendChild(this.tabs);
    this.tabs.appendChild(this.loginTab.element);
    this.tabs.appendChild(this.signupTab.element);
  }

  private update() {
    this.loginTab.checked = this.mode !== "login";
    this.signupTab.checked = this.mode !== "signup";
    this.submit.textContent = this.mode === "login" ? "Sign in" : "Sign up";
    this.title.textContent = this.mode === "login" ? "Login" : "Registration";
    this.passwordRepeatLabel.hidden = this.mode === "login";
  }

  private events() {
    this.on("open", () => this.reset());
    this.on("close", () => this.blur());
    this.closeBtn.addEventListener("click", () => this.close());
    this.loginTab.on("click", () => {
      this.mode = "login";
      this.reset();
    });
    this.signupTab.on("click", () => {
      this.mode = "signup";
      this.reset();
    });
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (this.password.value === "") {
        alert("Password is required");
        this.password.focus();
        return;
      }

      if (this.email.value === "") {
        alert("Email is required");
        this.focus();
        return;
      }

      if (this.mode === "login") {
        this.emit("login", {
          email: this.email.value,
          password: this.password.value,
        });
      } else {
        if (this.password.value !== this.passwordRepeat.value) {
          alert("Passwords do not match");
          this.passwordRepeat.select();
          return;
        }

        this.emit("signup", {
          email: this.email.value,
          password: this.password.value,
        });
      }
      this.close();
    });
  }

  private reset() {
    this.update();
    this.email.value = "";
    this.password.value = "";
    this.passwordRepeat.value = "";
    this.focus();
  }

  override open(mode: "login" | "signup" = "login") {
    this.mode = mode;
    this.isHidden = false;
    this.reset();
    return super.open();
  }

  private blur() {
    this.email.blur();
    this.password.blur();
    this.passwordRepeat.blur();
  }

  private focus() {
    this.blur();
    setTimeout(
      () =>
        this.email.focus({
          preventScroll: true,
        }),
      100
    );
  }

  override close() {
    this.reset();
    this.blur();
    setTimeout(() => {
      this.isHidden = true;
    }, 100);
    return super.close();
  }
}
