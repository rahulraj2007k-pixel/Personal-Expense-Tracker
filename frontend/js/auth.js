 const API_URL = "http://localhost:5000/api";

// ==================== REGISTER ====================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const message =
            document.getElementById("registerMessage");

        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match.";
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/auth/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                message.textContent =
                    data.message || "Registration failed.";
                return;
            }

            message.textContent =
                "Account created successfully!";

            registerForm.reset();

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);

        } catch (error) {
            console.error("Registration error:", error);

            message.textContent =
                "Unable to connect to server.";
        }
    });
}


// ==================== LOGIN ====================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        const message =
            document.getElementById("loginMessage");

        try {
            const response = await fetch(
                `${API_URL}/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                message.textContent =
                    data.message || "Login failed.";
                return;
            }

            // Save login information
            localStorage.setItem("token", data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            message.textContent =
                "Login successful!";

            // Open dashboard
            setTimeout(() => {
                window.location.href = "index.html";
            }, 500);

        } catch (error) {
            console.error("Login error:", error);

            message.textContent =
                "Unable to connect to server.";
        }
    });
}