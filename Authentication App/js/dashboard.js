document.addEventListener("DOMContentLoaded", () => {
  const userData = document.getElementById("userData");
  const logoutBtn = document.getElementById("logoutBtn");

  async function getUser() {
    try {
      const res = await fetch("https://api.freeapi.app/api/v1/users/current-user", {
        credentials: "include"
      });

      if (!res.ok) {
        window.location.href = "login.html";
        return;
      }

      const data = await res.json();

      userData.innerHTML = `
        <p><b>Username:</b> ${data.data.username}</p>
        <p><b>Email:</b> ${data.data.email}</p>
        <p><b>Role:</b> ${data.data.role}</p>
      `;
    } catch {
      window.location.href = "login.html";
    }
  }

  getUser();

  logoutBtn.addEventListener("click", async () => {
    await fetch("https://api.freeapi.app/api/v1/users/logout", {
      method: "POST",
      credentials: "include"
    });

    window.location.href = "login.html";
  });
});