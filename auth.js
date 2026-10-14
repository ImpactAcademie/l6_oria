const loginTab = document.querySelector("#login-tab");
const registerTab = document.querySelector("#register-tab");
const loginForm = document.querySelector("#login-form");
const registerForm = document.querySelector("#register-form");

function showForm(mode) {
  const isLogin = mode === "login";
  loginForm.hidden = !isLogin;
  registerForm.hidden = isLogin;
  loginTab.classList.toggle("is-active", isLogin);
  registerTab.classList.toggle("is-active", !isLogin);
  loginTab.setAttribute("aria-selected", String(isLogin));
  registerTab.setAttribute("aria-selected", String(!isLogin));
  document.querySelector("#form-title").textContent = isLogin ? "Bienvenue" : "Créer votre espace";
  document.querySelector(".form-heading .eyebrow").textContent = isLogin ? "Ravie de vous retrouver" : "On fait connaissance ?";
  (isLogin ? loginForm : registerForm).querySelector("input").focus();
}

function getAccounts() {
  try {
    const accounts = JSON.parse(localStorage.getItem("oria-accounts") || "[]");
    return Array.isArray(accounts) ? accounts : [];
  } catch {
    return [];
  }
}

function startSession(account) {
  sessionStorage.setItem("oria-session", JSON.stringify({ name: account.name, email: account.email }));
  window.location.assign("index.html");
}

loginTab.addEventListener("click", () => showForm("login"));
registerTab.addEventListener("click", () => showForm("register"));

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = loginForm.elements.email.value.trim().toLowerCase();
  const password = loginForm.elements.password.value;
  const account = getAccounts().find((entry) => entry.email === email && entry.password === password);
  const message = document.querySelector("#login-message");

  if (!account) {
    message.textContent = "E-mail ou mot de passe incorrect.";
    return;
  }

  message.textContent = "";
  startSession(account);
});

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = registerForm.elements.name.value.trim();
  const email = registerForm.elements.email.value.trim().toLowerCase();
  const password = registerForm.elements.password.value;
  const confirmation = registerForm.elements.confirm.value;
  const message = document.querySelector("#register-message");

  if (!name || !email || !password || !confirmation) {
    message.textContent = "Veuillez remplir tous les champs.";
    return;
  }
  if (password.length < 8) {
    message.textContent = "Le mot de passe doit contenir au moins 8 caractères.";
    return;
  }
  if (password !== confirmation) {
    message.textContent = "Les deux mots de passe ne correspondent pas.";
    return;
  }

  const accounts = getAccounts();
  if (accounts.some((account) => account.email === email)) {
    message.textContent = "Un compte existe déjà avec cette adresse e-mail.";
    return;
  }

  const account = { name, email, password };
  accounts.push(account);
  localStorage.setItem("oria-accounts", JSON.stringify(accounts));
  startSession(account);
});