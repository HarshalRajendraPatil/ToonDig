// Grabing all the important elements
const form = document.querySelector("form");
let password = document.getElementById("password");
let cPassword = document.getElementById("cPassword");
let err = document.querySelector(".error");
const btn = document.querySelector(".submit");

// Adding event listner to the submit button
btn.addEventListener("click", async (e) => {
  // Preventing the defautl behaviour of submit
  e.preventDefault();
  err.textContent = "";

  // Getting the value from the elements
  const passwordVal = password.value;

  // Contructing the object to be send
  const sendData = {
    password: passwordVal,
  };

  if (password.value !== cPassword.value) {
    err.textContent = "Passwords do not match";
  } else {
    // Making the POST request to api to create the user
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify(sendData),
    });
    const { success, error } = await res.json();

    // Handling the error if the user is not created
    if (success === false) {
      if (error.startsWith("User validation failed"))
        err.textContent = "Password must be of 8 characters";
      else err.textContent = error;
    }

    // Redirecting to the home page when the user is successfully created
    if (success === true) location.replace("/api/auth/login");
  }
});
