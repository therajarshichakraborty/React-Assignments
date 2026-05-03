form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = form.username.value;
  const password = form.password.value;

  try {
    btn.innerText = "Logging in...";

    const res = await fetch(
      "https://api.freeapi.app/api/v1/users/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    msg.innerText = "Login successful ✅";

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);

  } catch (err) {
    msg.innerText = err.message;
  } finally {
    btn.innerText = "Login";
  }
});