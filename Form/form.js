window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// Form validation
document.addEventListener("DOMContentLoaded", function () {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const fullNameInput = document.getElementById("fullName");
  const phoneNumberInput = document.getElementById("phoneNumber");

  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const fullNameError = document.getElementById("fullNameError");
  const phoneNumberError = document.getElementById("phoneNumberError");

  // Email validation
  emailInput.addEventListener("input", function () {
    const email = emailInput.value;
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      emailError.textContent = "Invalid email format (e.g., user@example.com)";
    } else {
      emailError.textContent = "";
    }
  });

  // Password validation
  passwordInput.addEventListener("input", function () {
    const password = passwordInput.value;
    if (password.length < 8) {
      passwordError.textContent = "Password must be at least 8 characters";
    } else {
      passwordError.textContent = "";
    }
  });

  // Full name validation (only for signup)
  if (fullNameInput) {
    fullNameInput.addEventListener("input", function () {
      const fullName = fullNameInput.value;
      if (fullName.length < 3 || /\d/.test(fullName)) {
        fullNameError.textContent = "Enter a valid full name (at least 3 letters, no numbers)";
      } else {
        fullNameError.textContent = "";
      }
    });
  }

// Phone Number validation (only for signup)
if (phoneNumberInput) {
  phoneNumberInput.addEventListener("input", function () {
    const phoneNumber = phoneNumberInput.value;
    // Adjust the regex based on your phone number format
    const phoneRegex = /^\d{11}$/; // Example: 10-digit phone number without any formatting

    if (!phoneRegex.test(phoneNumber)) {
      phoneNumberError.textContent = "Please enter a valid 11-digit phone number.";
    } else {
      phoneNumberError.textContent = "";
    }
  });
}

  // Form validation on submit
  document.getElementById("auth-form").addEventListener("submit", async function (event) {
    let valid = true;

    if (emailInput.value.trim() === "" || emailError.textContent !== "") valid = false;
    if (passwordInput.value.trim() === "" || passwordError.textContent !== "") valid = false;

    if (document.getElementById("signup-form").style.display === "block") {
      if (fullNameInput.value.trim() === "" || fullNameError.textContent !== "") valid = false;
      if (phoneNumberInput.value.trim() === "" || phoneNumberError.textContent !== "") valid = false;

    }

    if (!valid) {
      event.preventDefault(); // Prevent form submission if validation fails
    }
  });
});

// Toggle password visibility
const togglePassword = document.querySelector("#togglePassword");
const passwordInput = document.querySelector("#password");

togglePassword.addEventListener("click", function () {
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;
  this.classList.toggle("fa-eye-slash");
});

// Toggle between login and signup
document.getElementById("toggle-link").addEventListener("click", function () {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("signup-form").style.display = "block";
  document.getElementById("resetPasswordBtn").style.display = "block";
  document.getElementById("fullNameContainer").style.display = "block";
  document.getElementById("phoneNumberContainer").style.display = "block";
});

document.getElementById("toggle-link1").addEventListener("click", function () {
  document.getElementById("signup-form").style.display = "none";
  document.getElementById("login-form").style.display = "block";
  document.getElementById("resetPasswordBtn").style.display = "block";
  document.getElementById("fullNameContainer").style.display = "none";
  document.getElementById("phoneNumberContainer").style.display = "none";
});
