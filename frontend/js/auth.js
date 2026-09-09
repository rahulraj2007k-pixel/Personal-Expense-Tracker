 // ======================================================
// PERSONAL EXPENSE TRACKER - AUTHENTICATION
// ======================================================

// Same Render server se API call hogi
const API_URL = "/api";

// ======================================================
// REGISTER
// ======================================================

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const name =
                document.getElementById("name").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const password =
                document.getElementById("password").value;

            const message =
                document.getElementById("message");

            try {

                const response =
                    await fetch(
                        `${API_URL}/auth/register`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name,
                                email,
                                password
                            })
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Registration failed"
                    );

                }

                if (message) {

                    message.textContent =
                        "Registration successful! Redirecting to login...";

                    message.style.color =
                        "green";

                }

                setTimeout(() => {

                    window.location.href =
                        "login.html";

                }, 1000);

            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );

                if (message) {

                    message.textContent =
                        error.message ||
                        "Unable to register.";

                    message.style.color =
                        "red";

                }

            }

        }
    );

}

// ======================================================
// LOGIN
// ======================================================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const email =
                document.getElementById("email").value.trim();

            const password =
                document.getElementById("password").value;

            const message =
                document.getElementById("message");

            try {

                const response =
                    await fetch(
                        `${API_URL}/auth/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email,
                                password
                            })
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Login failed"
                    );

                }

                // ==================================================
                // SAVE LOGIN DATA
                // ==================================================

                if (data.token) {

                    localStorage.setItem(
                        "token",
                        data.token
                    );

                }

                if (data.user) {

                    localStorage.setItem(
                        "user",
                        JSON.stringify(data.user)
                    );

                }

                if (message) {

                    message.textContent =
                        "Login successful! Redirecting...";

                    message.style.color =
                        "green";

                }

                setTimeout(() => {

                    window.location.href =
                        "index.html";

                }, 500);

            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );

                if (message) {

                    message.textContent =
                        error.message ||
                        "Unable to login.";

                    message.style.color =
                        "red";

                }

            }

        }
    );

}

// ======================================================
// IF ALREADY LOGGED IN
// ======================================================

function checkLogin() {

    const token =
        localStorage.getItem("token");

    const currentPage =
        window.location.pathname;

    if (
        token &&
        (
            currentPage.endsWith(
                "login.html"
            ) ||
            currentPage.endsWith(
                "register.html"
            )
        )
    ) {

        window.location.href =
            "index.html";

    }

}

checkLogin();