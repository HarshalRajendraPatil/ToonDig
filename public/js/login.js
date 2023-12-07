// Grabing all the important elements
const form = document.querySelector("form");
let email = document.querySelector("#email");
let password = document.getElementById("password");
let err = document.querySelector(".error");
const btn = document.querySelector(".submit");

// Adding event listner to the submit button
btn.addEventListener("click", async (e) => {
  // Preventing the defautl behaviour of submit
  e.preventDefault();

  // Getting the value from the elements
  const emailVal = email.value;
  const passwordVal = password.value;

  // Contructing the object to be send
  const sendData = {
    email: emailVal,
    password: passwordVal,
  };

  // Making the POST request to api to find the user
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "Application/json" },
    body: JSON.stringify(sendData),
  });
  const { success, error } = await res.json();

  // Handling the error if the user is not signed up
  if (success === false) {
    err.textContent = error;
  }

  // Redirecting to the home page when the user is successfully created
  if (success === true) location.replace("/");
});
