// ==========================================
// TRANSACTIONS PAGE
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

        const user =
            JSON.parse(savedUser);

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

        "Content-Type":
            "application/json",

        "Authorization":
            `Bearer ${token}`

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


        const transactionList =
            Array.isArray(data)
                ? data
                : data.transactions || [];


        displayTransactions(
            transactionList
        );


    } catch (error) {

        console.error(
            "Load transactions error:",
            error
        );


        const container =
            document.getElementById(
                "transactions"
            );


        if (container) {

            container.innerHTML = `
                <p>
                    Unable to load transactions.
                </p>
            `;

        }

    }

}


// ==========================================
// DISPLAY TRANSACTIONS
// ==========================================

function displayTransactions(
    transactionList
) {

    const container =
        document.getElementById(
            "transactions"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        !transactionList ||
        transactionList.length === 0
    ) {

        container.innerHTML = `
            <p id="noTransactions">
                No transactions found.
            </p>
        `;

        return;

    }


    transactionList.forEach(
        transaction => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "transaction-item";


            const type =
                transaction.type;


            const amount =
                Number(
                    transaction.amount
                ) || 0;


            const category =
                transaction.category ||
                "Other";


            const description =
                transaction.description ||
                "No description";


            const date =
                transaction.date
                    ? new Date(
                        transaction.date
                    ).toLocaleDateString(
                        "en-IN"
                    )
                    : "";


            const sign =
                type === "income"
                    ? "+"
                    : "-";


            item.innerHTML = `

                <div class="transaction-info">

                    <h3>
                        ${escapeHTML(
                            category
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(
                            description
                        )}
                    </p>

                    <small>
                        ${date}
                        •
                        ${type}
                    </small>

                    <div
                        class="transaction-actions"
                    >

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


                <div
                    class="transaction-amount ${type}"
                >

                    ${sign}
                    ${formatCurrency(amount)}

                </div>

            `;


            container.appendChild(item);

        }
    );

}


// ==========================================
// FILTER TRANSACTIONS
// ==========================================

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

        params.append(
            "type",
            type
        );

    }


    if (category) {

        params.append(
            "category",
            category
        );

    }


    if (date) {

        params.append(
            "date",
            date
        );

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


        if (response.status === 401) {

            logout();

            return;

        }


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Filter failed"
            );

        }


        const transactionList =
            Array.isArray(data)
                ? data
                : data.transactions || [];


        displayTransactions(
            transactionList
        );


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
// CLEAR FILTERS
// ==========================================

function clearFilters() {

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


// ==========================================
// EDIT TRANSACTION
// ==========================================

async function editTransaction(id) {

    try {

        // Get current transactions
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


        const transactionList =
            Array.isArray(data)
                ? data
                : data.transactions || [];


        const transaction =
            transactionList.find(
                item =>
                    item._id === id
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


        if (
            newDescription === null
        ) {

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
                            Number(
                                newAmount
                            ),

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
// LOGOUT
// ==========================================

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


// ==========================================
// CURRENCY FORMAT
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