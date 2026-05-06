const BASE = "https://api.freeapi.app/api/v1/users";

function showView(name) {
  document
    .querySelectorAll(".view")
    .forEach((v) => v.classList.remove("active"));
  document.getElementById("view-" + name).classList.add("active");
}

function setLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  btn.classList.toggle("loading", loading);
  btn.disabled = loading;
}

function showAlert(id, type, message) {
  const el = document.getElementById(id);
  el.className = "alert alert-" + type + " visible";
  el.innerHTML = `
      <svg class="alert-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${
          type === "success"
            ? '<polyline points="20 6 9 17 4 12"></polyline>'
            : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
        }
      </svg>
      <span>${message}</span>`;
  setTimeout(() => el.classList.remove("visible"), 5000);
}
const fullName = val("reg-fullname");

body: (JSON.stringify({ username, email, password, role, fullName }),
  function hideAlert(id) {
    document.getElementById(id).classList.remove("visible");
  });

function val(id) {
  return document.getElementById(id).value.trim();
}
function populateProfile(user) {
  const name = user.fullName || user.username || "—";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  document.getElementById("profile-name").textContent = name;
  document.getElementById("profile-username").textContent =
    "@" + (user.username || "—");
  document.getElementById("profile-email").textContent = user.email || "—";
  document.getElementById("profile-role").textContent = user.role || "—";
  document.getElementById("profile-id").textContent = user._id
    ? user._id.slice(-12) + "…"
    : "—";
  document.getElementById("profile-verified").textContent = user.isEmailVerified
    ? "✓ Verified"
    : "✗ Not verified";

  const avatarEl = document.getElementById("profile-avatar");
  if (user.avatar?.url) {
    avatarEl.innerHTML = `<img src="${user.avatar.url}" alt="avatar" onerror="this.parentElement.textContent='${initials}'" />`;
  } else {
    avatarEl.textContent = initials || "?";
  }
}

async function handleRegister() {
  hideAlert("register-alert");
  const username = val("reg-username");
  const email = val("reg-email");
  const password = val("reg-password");
  const role = val("reg-role") || document.getElementById("reg-role").value;

  if (!username || !email || !password) {
    showAlert("register-alert", "error", "Please fill in all fields.");
    return;
  }

  setLoading("btn-register", true);
  try {
    const res = await fetch(`${BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, email, password, role }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Registration failed.");
    showAlert("register-alert", "success", "Account created! Signing you in…");
    setTimeout(() => showView("login"), 1400);
  } catch (err) {
    showAlert("register-alert", "error", err.message);
  } finally {
    setLoading("btn-register", false);
  }
}

async function handleLogin() {
  hideAlert("login-alert");
  const username = val("login-username");
  const password = val("login-password");

  if (!username || !password) {
    showAlert(
      "login-alert",
      "error",
      "Please enter your username and password.",
    );
    return;
  }

  setLoading("btn-login", true);
  try {
    const res = await fetch(`${BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Login failed.");
    if (data.data?.accessToken) {
      localStorage.setItem("accessToken", data.data.accessToken);
    }

    const user = data.data?.user;
    if (user) populateProfile(user);
    showView("profile");
    await handleGetCurrentUser(true);
  } catch (err) {
    showAlert("login-alert", "error", err.message);
  } finally {
    setLoading("btn-login", false);
  }
}
async function handleGetCurrentUser(silent = false) {
  if (!silent) setLoading("btn-refresh", true);
  try {
    const token = localStorage.getItem("accessToken");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${BASE}/current-user`, {
      method: "GET",
      headers,
      credentials: "include",
    });
    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem("accessToken");
        showView("login");
        return;
      }
      throw new Error(data.message || "Could not fetch user.");
    }

    populateProfile(data.data);
    if (!silent) showAlert("profile-alert", "success", "Profile refreshed.");
  } catch (err) {
    if (!silent) showAlert("profile-alert", "error", err.message);
  } finally {
    if (!silent) setLoading("btn-refresh", false);
  }
}

async function handleLogout() {
  setLoading("btn-logout", true);
  try {
    const token = localStorage.getItem("accessToken");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    await fetch(`${BASE}/logout`, {
      method: "POST",
      headers,
      credentials: "include",
    });

    localStorage.removeItem("accessToken");
    showView("login");
    showAlert("login-alert", "success", "Signed out successfully.");
  } catch (err) {
    showAlert("profile-alert", "error", "Logout failed: " + err.message);
  } finally {
    setLoading("btn-logout", false);
  }
}

document.getElementById("login-password").addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleLogin();
});
document.getElementById("reg-password").addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleRegister();
});

(async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return;
  try {
    const res = await fetch(`${BASE}/current-user`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      populateProfile(data.data);
      showView("profile");
    } else {
      localStorage.removeItem("accessToken");
    }
  } catch (_) {
    localStorage.removeItem("accessToken");
  }
})();
