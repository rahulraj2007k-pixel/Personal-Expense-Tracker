 // ======================================================
// PERSONAL EXPENSE TRACKER - DASHBOARD
// ======================================================

// Same server se API call hogi.
// Local: http://localhost:5000/api
// Render: https://your-app.onrender.com/api
const API_URL = "/api";

const token = localStorage.getItem("token");

// ======================================================
// AUTH CHECK
// ======================================================

if (!token) {
    window.location.href = "login.html";
}

// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener("DOMContentLoaded", () => {
    showUserName();
    setTodayDate();
    loadDashboard();
    loadTransactions();
});

// ======================================================
// USER NAME
// ======================================================

function showUserName() {

    const userName = document.getElementById("userName");
    const savedUser = localStorage.getItem("user");

    if (!userName || !savedUser) {
        return;
    }

    try {

        const user = JSON.parse(savedUser);

        userName.textContent =
            user.name || user.email || "";

    } catch (error) {

        console.error("User data error:", error);

    }
}

// ======================================================
// HEADERS
// ======================================================

function getHeaders() {

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };

}

// ======================================================
// LOAD DASHBOARD
// ======================================================

async function loadDashboard() {

    try {

        const response = await fetch(
            `${API_URL}/transactions`,
            {
                method: "GET",
                headers: getHeaders()
            }
        );

        if (response.status === 401) {
            logout();
            return;
        }

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message || "Failed to load dashboard"
            );

        }

        const transactions =
            Array.isArray(data)
                ? data
                : data.transactions || [];

        calculateSummary(transactions);
        displayRecentTransactions(transactions);
        createExpenseChart(transactions);

    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }

}

// ======================================================
// LOAD TRANSACTIONS
// ======================================================

async function loadTransactions() {

    try {

        const response = await fetch(
            `${API_URL}/transactions`,
            {
                method: "GET",
                headers: getHeaders()
            }
        );

        if (response.status === 401) {
            logout();
            return;
        }

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message || "Failed to load transactions"
            );

        }

        const transactions =
            Array.isArray(data)
                ? data
                : data.transactions || [];

        calculateSummary(transactions);
        displayRecentTransactions(transactions);
        createExpenseChart(transactions);

    } catch (error) {

        console.error(
            "Transaction loading error:",
            error
        );

    }

}

// ======================================================
// CALCULATE SUMMARY
// ======================================================

function calculateSummary(transactions) {

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(transaction => {

        const amount =
            Number(transaction.amount) || 0;

        if (transaction.type === "income") {

            totalIncome += amount;

        } else if (transaction.type === "expense") {

            totalExpense += amount;

        }

    });

    const balance =
        totalIncome - totalExpense;

    const incomeElement =
        document.getElementById("totalIncome");

    const expenseElement =
        document.getElementById("totalExpense");

    const balanceElement =
        document.getElementById("balance");

    if (incomeElement) {

        incomeElement.textContent =
            formatCurrency(totalIncome);

    }

    if (expenseElement) {

        expenseElement.textContent =
            formatCurrency(totalExpense);

    }

    if (balanceElement) {

        balanceElement.textContent =
            formatCurrency(balance);

    }

}

// ======================================================
// DISPLAY RECENT TRANSACTIONS
// ======================================================

function displayRecentTransactions(transactions) {

    const container =
        document.getElementById(
            "transactionsContainer"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (
        !transactions ||
        transactions.length === 0
    ) {

        container.innerHTML = `
            <p id="noTransactions">
                No transactions found.
            </p>
        `;

        return;
    }

    // Latest 5 transactions
    const recentTransactions =
        transactions.slice(0, 5);

    recentTransactions.forEach(transaction => {

        const item =
            document.createElement("div");

        item.className =
            "transaction-item";

        const type =
            transaction.type;

        const amount =
            Number(transaction.amount) || 0;

        const category =
            transaction.category || "Other";

        const description =
            transaction.description ||
            "No description";

        const date =
            transaction.date
                ? new Date(
                    transaction.date
                ).toLocaleDateString("en-IN")
                : "";

        const sign =
            type === "income"
                ? "+"
                : "-";

        item.innerHTML = `

            <div class="transaction-info">

                <h3>
                    ${escapeHTML(category)}
                </h3>

                <p>
                    ${escapeHTML(description)}
                </p>

                <small>
                    ${date} • ${type}
                </small>

            </div>

            <div class="transaction-amount ${type}">

                ${sign}
                ${formatCurrency(amount)}

            </div>

        `;

        container.appendChild(item);

    });

}

// ======================================================
// ADD TRANSACTION
// ======================================================

const transactionForm =
    document.getElementById(
        "transactionForm"
    );

if (transactionForm) {

    transactionForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const type =
                document.getElementById(
                    "type"
                ).value;

            const amount =
                document.getElementById(
                    "amount"
                ).value;

            const category =
                document.getElementById(
                    "category"
                ).value.trim();

            const date =
                document.getElementById(
                    "date"
                ).value;

            const description =
                document.getElementById(
                    "description"
                ).value.trim();

            const message =
                document.getElementById(
                    "transactionMessage"
                );

            try {

                const response =
                    await fetch(
                        `${API_URL}/transactions`,
                        {
                            method: "POST",

                            headers:
                                getHeaders(),

                            body:
                                JSON.stringify({
                                    type,
                                    amount:
                                        Number(amount),
                                    category,
                                    date,
                                    description
                                })
                        }
                    );

                if (response.status === 401) {

                    logout();
                    return;

                }

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to add transaction"
                    );

                }

                if (message) {

                    message.textContent =
                        "Transaction added successfully!";

                    message.style.color =
                        "green";

                }

                transactionForm.reset();

                setTodayDate();

                await loadDashboard();

            } catch (error) {

                console.error(
                    "Add transaction error:",
                    error
                );

                if (message) {

                    message.textContent =
                        error.message ||
                        "Unable to add transaction.";

                    message.style.color =
                        "red";

                }

            }

        }
    );

}

// ======================================================
// SET TODAY'S DATE
// ======================================================

function setTodayDate() {

    const dateInput =
        document.getElementById("date");

    if (!dateInput) {
        return;
    }

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    dateInput.value = today;

}

// ======================================================
// EXPENSE CHART
// ======================================================

let expenseChart = null;

function createExpenseChart(transactions) {

    const canvas =
        document.getElementById(
            "expenseChart"
        );

    if (!canvas) {
        return;
    }

    const categoryTotals = {};

    transactions.forEach(transaction => {

        if (
            transaction.type !==
            "expense"
        ) {
            return;
        }

        const category =
            transaction.category ||
            "Other";

        const amount =
            Number(transaction.amount) || 0;

        if (!categoryTotals[category]) {

            categoryTotals[category] = 0;

        }

        categoryTotals[category] +=
            amount;

    });

    const labels =
        Object.keys(categoryTotals);

    const values =
        Object.values(categoryTotals);

    if (expenseChart) {

        expenseChart.destroy();

    }

    if (
        labels.length === 0 ||
        typeof Chart === "undefined"
    ) {

        return;

    }

    expenseChart =
        new Chart(
            canvas,
            {
                type: "doughnut",

                data: {

                    labels: labels,

                    datasets: [
                        {
                            data: values
                        }
                    ]

                },

                options: {

                    responsive: true,

                    plugins: {

                        legend: {

                            position:
                                "bottom"

                        }

                    }

                }

            }
        );

}

// ======================================================
// LOGOUT
// ======================================================

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        logout
    );

}

function logout() {

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "user"
    );

    window.location.href =
        "login.html";

}

// ======================================================
// CURRENCY FORMAT
// ======================================================

function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(amount);

}

// ======================================================
// HTML SECURITY
// ======================================================

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}