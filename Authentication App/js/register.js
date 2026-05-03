const form = document.getElementById("registerForm");
const msg = document.getElementById("msg");
const btn = document.getElementById("btn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  btn.innerText = "Loading...";
  btn.disabled = true;

  const data = {
    username: username.value,
    email: email.value,
    password: password.value,
    role: role.value
  };

  try {
    const res = await fetch("https://api.freeapi.app/api/v1/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    msg.innerText = result.message || "Registered!";
    msg.className = "text-green-400";

    form.reset();
  } catch (err) {
    msg.innerText = "Something went wrong";
    msg.className = "text-red-400";
  }

  btn.innerText = "Register";
  btn.disabled = false;

  console.log("Register JS loaded");
});