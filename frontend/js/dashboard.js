 // ==========================================
// DASHBOARD
// ==========================================

const API_URL = "http://localhost:5000/api";

const token = localStorage.getItem("token");


// ==========================================
// LOGIN CHECK
// ==========================================

if (!token) {
    window.location.href = "login.html";
}


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    showUserName();

    loadTransactions();

    setTodayDate();

});


// ==========================================
// SHOW USER NAME
// ==========================================

function showUserName() {

    const userName =
        document.getElementById("userName");

    const savedUser =
        localStorage.getItem("user");

    if (!userName || !savedUser) {
        return;
    }

    try {

        const user = JSON.parse(savedUser);

        userName.textContent =
            user.name || user.email || "";

    } catch (error) {

        console.error(
            "User data error:",
            error
        );

    }

}


// ==========================================
// API HEADERS
// ==========================================

function getHeaders() {

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };

}


// ==========================================
// LOAD TRANSACTIONS
// ==========================================

async function loadTransactions() {

    try {

        const response =
            await fetch(
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


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load transactions"
            );

        }


        // Backend returns:
        // { transactions: [...] }

        const transactions =
            Array.isArray(data)
                ? data
                : data.transactions || [];


        console.log(
            "Transactions:",
            transactions
        );


        updateSummary(transactions);

        displayTransactions(transactions);

        updateExpenseChart(transactions);


    } catch (error) {

        console.error(
            "Load transactions error:",
            error
        );


        const container =
            document.getElementById(
                "transactionsContainer"
            );


        if (container) {

            container.innerHTML = `
                <p id="noTransactions">
                    Unable to load transactions.
                </p>
            `;

        }

    }

}


// ==========================================
// UPDATE SUMMARY
// ==========================================

function updateSummary(transactions) {

    let totalIncome = 0;

    let totalExpense = 0;


    transactions.forEach(transaction => {

        const amount =
            Number(transaction.amount) || 0;


        if (transaction.type === "income") {

            totalIncome += amount;

        }


        if (transaction.type === "expense") {

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


// ==========================================
// DISPLAY TRANSACTIONS
// ==========================================

function displayTransactions(transactions) {

    const container =
        document.getElementById(
            "transactionsContainer"
        );


    if (!container) {

        console.error(
            "transactionsContainer not found"
        );

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


    transactions.forEach(transaction => {

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


                <div class="transaction-actions">

                    <button
                        class="edit-btn"
                        onclick="editTransaction('${transaction._id}')"
                    >
                        Edit
                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteTransaction('${transaction._id}')"
                    >
                        Delete
                    </button>

                </div>

            </div>


            <div class="transaction-amount ${type}">

                ${sign}
                ${formatCurrency(amount)}

            </div>

        `;


        container.appendChild(item);

    });

}


// ==========================================
// ADD TRANSACTION
// ==========================================

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
                document.getElementById("type").value;

            const amount =
                document.getElementById("amount").value;

            const category =
                document.getElementById("category").value.trim();

            const date =
                document.getElementById("date").value;

            const description =
                document.getElementById("description").value.trim();


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

                            headers: getHeaders(),

                            body: JSON.stringify({
                                type,
                                amount: Number(amount),
                                category,
                                date,
                                description
                            })
                        }
                    );


                const data =
                    await response.json();


                if (response.status === 401) {

                    logout();

                    return;

                }


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Transaction could not be added"
                    );

                }


                if (message) {

                    message.textContent =
                        "Transaction added successfully!";

                    message.style.color =
                        "#16a34a";

                }


                transactionForm.reset();

                setTodayDate();

                loadTransactions();


            } catch (error) {

                console.error(
                    "Add transaction error:",
                    error
                );


                if (message) {

                    message.textContent =
                        error.message;

                    message.style.color =
                        "#dc2626";

                }

            }

        }
    );

}


// ==========================================
// SET TODAY DATE
// ==========================================

function setTodayDate() {

    const dateInput =
        document.getElementById("date");


    if (!dateInput || dateInput.value) {
        return;
    }


    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    dateInput.value =
        `${year}-${month}-${day}`;

}


// ==========================================
// FILTER
// ==========================================

const filterBtn =
    document.getElementById(
        "filterBtn"
    );


if (filterBtn) {

    filterBtn.addEventListener(
        "click",
        filterTransactions
    );

}


async function filterTransactions() {

    const type =
        document.getElementById(
            "filterType"
        ).value;


    const category =
        document.getElementById(
            "filterCategory"
        ).value.trim();


    const date =
        document.getElementById(
            "filterDate"
        ).value;


    const params =
        new URLSearchParams();


    if (type) {
        params.append("type", type);
    }


    if (category) {
        params.append("category", category);
    }


    if (date) {
        params.append("date", date);
    }


    try {

        const response =
            await fetch(
                `${API_URL}/transactions?${params.toString()}`,
                {
                    method: "GET",
                    headers: getHeaders()
                }
            );


        const data =
            await response.json();


        if (response.status === 401) {

            logout();

            return;

        }


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Filter failed"
            );

        }


        const transactions =
            Array.isArray(data)
                ? data
                : data.transactions || [];


        displayTransactions(transactions);


    } catch (error) {

        console.error(
            "Filter error:",
            error
        );

        alert(
            "Unable to filter transactions."
        );

    }

}


// ==========================================
// CLEAR FILTER
// ==========================================

const clearFilterBtn =
    document.getElementById(
        "clearFilterBtn"
    );


if (clearFilterBtn) {

    clearFilterBtn.addEventListener(
        "click",
        () => {

            document.getElementById(
                "filterType"
            ).value = "";


            document.getElementById(
                "filterCategory"
            ).value = "";


            document.getElementById(
                "filterDate"
            ).value = "";


            loadTransactions();

        }
    );

}


// ==========================================
// DELETE TRANSACTION
// ==========================================

async function deleteTransaction(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this transaction?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/transactions/${id}`,
                {
                    method: "DELETE",
                    headers: getHeaders()
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Delete failed"
            );

        }


        alert(
            "Transaction deleted successfully!"
        );


        loadTransactions();


    } catch (error) {

        console.error(
            "Delete error:",
            error
        );


        alert(
            error.message ||
            "Unable to delete transaction."
        );

    }

}


// ==========================================
// EDIT TRANSACTION
// ==========================================

async function editTransaction(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/transactions`,
                {
                    method: "GET",
                    headers: getHeaders()
                }
            );


        const data =
            await response.json();


        const transactions =
            Array.isArray(data)
                ? data
                : data.transactions || [];


        const transaction =
            transactions.find(
                item => item._id === id
            );


        if (!transaction) {

            alert(
                "Transaction not found."
            );

            return;

        }


        const newAmount =
            prompt(
                "Enter new amount:",
                transaction.amount
            );


        if (
            newAmount === null ||
            newAmount.trim() === ""
        ) {

            return;

        }


        const newCategory =
            prompt(
                "Enter category:",
                transaction.category
            );


        if (
            newCategory === null ||
            newCategory.trim() === ""
        ) {

            return;

        }


        const newDescription =
            prompt(
                "Enter description:",
                transaction.description || ""
            );


        if (newDescription === null) {
            return;
        }


        const updateResponse =
            await fetch(
                `${API_URL}/transactions/${id}`,
                {
                    method: "PUT",

                    headers: getHeaders(),

                    body: JSON.stringify({

                        type:
                            transaction.type,

                        amount:
                            Number(newAmount),

                        category:
                            newCategory,

                        date:
                            transaction.date,

                        description:
                            newDescription

                    })
                }
            );


        const updateData =
            await updateResponse.json();


        if (!updateResponse.ok) {

            throw new Error(
                updateData.message ||
                "Update failed"
            );

        }


        alert(
            "Transaction updated successfully!"
        );


        loadTransactions();


    } catch (error) {

        console.error(
            "Edit error:",
            error
        );


        alert(
            error.message ||
            "Unable to update transaction."
        );

    }

}


// ==========================================
// EXPENSE CHART
// ==========================================

let expenseChart = null;


function updateExpenseChart(transactions) {

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
            transaction.type !== "expense"
        ) {

            return;

        }


        const category =
            transaction.category ||
            "Other";


        const amount =
            Number(transaction.amount) || 0;


        categoryTotals[category] =
            (categoryTotals[category] || 0)
            + amount;

    });


    const labels =
        Object.keys(categoryTotals);


    const values =
        Object.values(categoryTotals);


    if (expenseChart) {

        expenseChart.destroy();

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
                            position: "bottom"
                        }

                    }

                }

            }
        );

}


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href =
        "login.html";

}


// ==========================================
// CURRENCY
// ==========================================

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


// ==========================================
// SECURITY
// ==========================================

function escapeHTML(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}