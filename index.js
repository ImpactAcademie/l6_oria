let session;

try {
  session = JSON.parse(sessionStorage.getItem("oria-session") || "null");
} catch {
  session = null;
}

if (!session || !session.email) {
  window.location.replace("auth.html");
} else {
  const firstName = session.name?.trim().split(/\s+/)[0];
  document.querySelector("#greeting").textContent = firstName
    ? `Bienvenue dans votre espace, ${firstName}.`
    : "Bienvenue dans votre espace.";

  document.querySelector("#logout-button").addEventListener("click", () => {
    sessionStorage.removeItem("oria-session");
    window.location.assign("auth.html");
  });
}