document.addEventListener("DOMContentLoaded", () => {
  // Add event listeners for login and registration forms
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegistration);
  }

  //   const token = localStorage.getItem("token");
  const authButton = document.getElementById("auth-button");
  const mainContent = document.getElementById("main-content");

  // Handle login/logout button click
  authButton.textContent = isLoggedIn() ? "Logout" : "Login";
  authButton.addEventListener("click", handleAuthClick);

  // Display appropriate content based on authentication state
  if (mainContent) {
    if (isLoggedIn()) {
      const user = JSON.parse(localStorage.getItem("user"));
      displayDashboard(user.role); // Show nav and content
    } else {
      displayIndex();
    }
  }
});

// Redirect based on login state
function handleAuthClick() {
  if (isLoggedIn()) {
    logoutUser();
  } else {
    window.location.href = "login.html";
  }
}

// Handle Login
async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (response.ok) {
      alert("Login successful!");
      localStorage.setItem(
        "user",
        JSON.stringify({
          token: result.token,
          role: result.role,
        })
      );
      // Save user data
      window.location.href = "index.html";
    } else {
      alert(result.message || "Login failed!");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again.");
  }
}

// Handle Registration
async function handleRegistration(event) {
  event.preventDefault();
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  try {
    const response = await fetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (response.ok) {
      alert("Registration successful! Please log in.");
      window.location.href = "login.html";
    } else {
      alert(result.message || "Registration failed!");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again.");
  }
}

// Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem("user") !== null;
}

// Logout user
function logoutUser() {
  localStorage.removeItem("user");
  alert("You have been logged out.");
  window.location.href = "index.html";
}

// Display navigation bar and initialize content
function displayDashboard(role) {
  const mainContent = document.getElementById("main-content");
  if (role === "admin") {
    mainContent.innerHTML = `<h2>This is Admin Dashboard</h2><p>Welcome, Admin! Manage movies here.</p>`;
  } else {
    mainContent.innerHTML = `<h2>This is User Dashboard</h2><p>List of movies for users.</p>`;

    displayIndex();
  }
}

// Navigation logic
document.getElementById("MoviesBtn").addEventListener("click", () => {
  if (isLoggedIn()) {
    const user = JSON.parse(localStorage.getItem("user"));
    displayMovies(user.role);
  } else {
    alert("Please log in to access this section.");
    window.location.href = "login.html";
  }
});

// Display content based on role
function displayMovies(role) {
  const mainContent = document.getElementById("main-content");
  if (role === "admin") {
    mainContent.innerHTML = `<h2>Movie Section</h2><p>add movie</p>`;
  } else {
    mainContent.innerHTML = `<h2>Available Movies</h2><p>List of movies for users.</p>`;
  }
}

document.getElementById("pushpaMovie").addEventListener("click", () => {
  if (isLoggedIn()) {
    displayTheaters();
  } else {
    alert("Please log in to access this section.");
    window.location.href = "login.html";
  }
});

function displayTheaters() {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = `<h2>Available Theaters</h2><p>List of theaters</p>`;
}

// Display navigation bar and initialize content
function displayIndex() {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = `
      <div>
        <section class="RecoMovies">
        <h1>Recommended Movies</h1>
        <div>
          <div class="movieCard" id="pushpaMovie">
            <img
              src="https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@like_202006280402.png,lx-24,ly-617,w-29,l-end:l-text,ie-MS45TSBMaWtlcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00356724-txsuklqlke-portrait.jpg"
              alt="Avatar"
              style="width: 100%"
            />
            <div class="container">
              <h4><b>Pushpa 2: The Rule</b></h4>
              <p>Action , Thriller</p>
            </div>
          </div>
          <div class="movieCard">
            <img
              src="https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@star-icon-202203010609.png,lx-24,ly-615,w-29,l-end:l-text,ie-OC40LzEwICA2LjZLIFZvdGVz,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00387901-zzezpljyvq-portrait.jpg"
              alt="Avatar"
              style="width: 100%"
            />
            <div class="container">
              <h4><b>Moana 2</b></h4>
              <p>Adventure , Animation , Comedy , Fantasy</p>
            </div>
          </div>
          <div class="movieCard">
            <img
              src="https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@star-icon-202203010609.png,lx-24,ly-615,w-29,l-end:l-text,ie-OC8xMCAgNiBWb3Rlcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00419016-vcafpqzgxp-portrait.jpg"
              alt="Avatar"
              style="width: 100%"
            />
            <div class="container">
              <h4><b>All the Long Nights</b></h4>
              <p>Drama</p>
            </div>
          </div>
          <div class="movieCard">
            <img
              src="https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@star-icon-202203010609.png,lx-24,ly-615,w-29,l-end:l-text,ie-OS4yLzEwICA1LjhLIFZvdGVz,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00417142-ylxjreqdxh-portrait.jpg"
              alt="Avatar"
              style="width: 100%"
            />
            <div class="container">
              <h4><b>Dharmarakshak</b></h4>
              <p>Action , Drama , Historical , Period</p>
            </div>
          </div>
        </div>
        </section>
      </div>
    `;
}

const user = localStorage.getItem("user"); // Ensure this matches where you store your token
fetch("http://localhost:3000/movies/admin", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${user.token}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
