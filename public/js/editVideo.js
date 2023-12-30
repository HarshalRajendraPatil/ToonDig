// Grabing all the important elements
const form = document.querySelector("form");
const name = document.getElementById("name");
const description = document.getElementById("description");
const category = document.getElementById("category");
const genre = document.getElementById("genre");
const releaseYear = document.getElementById("releaseYear");
const url = document.getElementById("url");
const error = document.querySelector(".error");
const btn = document.querySelector(".btn");

// Adding event listner to the submit button
btn.addEventListener("click", async (e) => {
  // Preventing the defautl behaviour of submit
  e.preventDefault();

  // Getting the value from the elements
  const data = {
    title: name.value,
    description: description.value,
    category: category.value,
    genre: genre.value,
    releaseYear: releaseYear.value,
    videoUrl: url.value,
  };

  // Making the PUT request to api to edit the video
  const res = await fetch(
    `/api/videos/edit/${window.location.href.split("/").pop()}`,
    {
      method: "PUT",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify(data),
    }
  );

  // Getting the response from the video
  const response = await res.json();

  // Handling the error if the form is not filled completely
  if (!response.status) error.textContent = response.error;

  // This is needed to be updated later
  if (response.status) console.log(response);
});
