// Grabing all the important elements
const form = document.querySelector("form");
let email = document.querySelector("#email");
let err = document.querySelector(".error");
const btn = document.querySelector(".submit");
const msg = document.querySelector(".success");
const resend = document.querySelector(".send-again");

// Adding event listner to the submit button
btn.addEventListener("click", async (e) => {
  // Preventing the defautl behaviour of submit
  e.preventDefault();

  // Getting the value from the elements
  const emailVal = email.value;

  // Contructing the object to be send
  const sendData = {
    email: emailVal,
  };

  // Making the POST request to api to create the user
  const res = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "Application/json" },
    body: JSON.stringify(sendData),
  });
  const result = await res.json();

  // Handling the error if the user is not created
  if (result.success === false) {
    if (result.error.startsWith("User validation failed"))
      err.textContent = "Password must be of 8 characters";
    else err.textContent = result.error;
  }

  // Reseting after the mail is being send and enabling to send again after 10s.
  if (result.success === true) {
    err.textContent = "";
    msg.textContent = "Reset link was sent to your email.";
    btn.setAttribute("disabled", "");
    resend.textContent = "Resend again in 10s.";

    setTimeout(() => {
      msg.textContent = "";
      resend.textContent = "";
      err.textContent = "";
      btn.removeAttribute("disabled");
    }, 10000);
  }
});
