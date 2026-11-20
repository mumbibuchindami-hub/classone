/* =========================================================
   CLASS ONE - MAIN JAVASCRIPT
   ========================================================= */


/* =========================================================
   FIREBASE
   ========================================================= */

import { initializeApp, getApps, getApp }
    from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyAQBRnfmZIP_Ahk0WiyoKqf87NTaggt4vI",
    authDomain: "class-one-263aa.firebaseapp.com",
    projectId: "class-one-263aa",
    storageBucket: "class-one-263aa.firebasestorage.app",
    messagingSenderId: "534348284001",
    appId: "1:534348284001:web:1730328fec2eb21bc3ea20"
};


/* Reuse the default app when a page also starts Firebase in its own script.
   Calling initializeApp() twice with no name throws "duplicate-app" and
   stops this whole file from running. */
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);




/* =========================================================
   SMOOTH NAVIGATION
   ========================================================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (event) {

        const targetId = this.getAttribute("href");

        if (targetId === "#") return;

        const target = document.querySelector(targetId);

        if (target) {

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

});


/* =========================================================
   MOBILE MENU
   ========================================================= */

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        navLinks.classList.toggle("active");

    });

    navLinks.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("active");

        });

    });

}


/* =========================================================
   SIGN UP
   ========================================================= */

const signupForm = document.querySelector("#signup-form");

if (signupForm) {

    signupForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const name =
            document.querySelector("#fullname")?.value.trim();

        const email =
            document.querySelector("#signup-email")?.value.trim();

        const phone =
            document.querySelector("#phone")?.value.trim();

        const password =
            document.querySelector("#signup-password")?.value;

        const confirmPassword =
            document.querySelector("#confirm-password")?.value;


        if (!name || !email || !password || !confirmPassword) {

            alert("Please fill in all required fields.");

            return;

        }


        if (password !== confirmPassword) {

            alert("Passwords do not match.");

            return;

        }


        if (password.length < 6) {

            alert("Your password must contain at least 6 characters.");

            return;

        }


        try {

            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            await updateProfile(userCredential.user, {

                displayName: name

            });


            alert("Account created successfully!");

            window.location.href = "login.html";


        } catch (error) {

            console.error(error);

            switch (error.code) {

                case "auth/email-already-in-use":

                    alert(
                        "This email already has a Class One account. Please log in instead."
                    );

                    break;


                case "auth/invalid-email":

                    alert("Please enter a valid email address.");

                    break;


                case "auth/weak-password":

                    alert("Please choose a stronger password.");

                    break;


                default:

                    alert(
                        "Unable to create your account. " +
                        error.message
                    );

            }

        }

    });

}


/* =========================================================
   LOGIN
   ========================================================= */

const loginForm = document.querySelector("#login-form");

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const email =
            document.querySelector("#email")?.value.trim();

        const password =
            document.querySelector("#password")?.value;


        if (!email || !password) {

            alert("Please enter your email and password.");

            return;

        }


        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


            alert(
                "Login successful! Welcome to Class One."
            );


            window.location.href = "dashboard.html";


        } catch (error) {

            console.error(error);

            switch (error.code) {

                case "auth/invalid-credential":

                    alert("Incorrect email or password.");

                    break;


                case "auth/invalid-email":

                    alert("Please enter a valid email address.");

                    break;


                case "auth/too-many-requests":

                    alert(
                        "Too many login attempts. Please try again later."
                    );

                    break;


                default:

                    alert(
                        "Unable to log in. " +
                        error.message
                    );

            }

        }

    });

}


/* =========================================================
   DASHBOARD
   ========================================================= */

const userNameElement =
    document.querySelector("#user-name");

const userEmailElement =
    document.querySelector("#user-email");

const logoutButton =
    document.querySelector("#logout-btn");


if (
    userNameElement ||
    userEmailElement ||
    logoutButton
) {

    onAuthStateChanged(auth, (user) => {

        if (user) {

            if (userNameElement) {

                userNameElement.textContent =
                    user.displayName || "Customer";

            }


            if (userEmailElement) {

                userEmailElement.textContent =
                    user.email || "";

            }

        } else {

            window.location.href = "index.html";

        }

    });

}


/* =========================================================
   LOGOUT
   ========================================================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            try {

                await signOut(auth);

                alert("You have been logged out.");

                window.location.href = "login.html";

            } catch (error) {

                console.error(error);

                alert(
                    "Unable to log out. Please try again."
                );

            }

        }
    );

}


/* =========================================================
   CONTACT FORM
   ========================================================= */

const contactForm = document.getElementById("contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const status = document.getElementById("form-status");
        const button = document.getElementById("send-btn");

        button.disabled = true;
        button.textContent = "Sending...";

        const formData = new FormData(contactForm);

        try {
            const response = await fetch("https://formspree.io/f/mjykwjye", {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json"
                }
            });

            if (response.ok) {
                status.textContent = "Thank you! Your message has been sent successfully.";
                status.style.color = "green";
                contactForm.reset();
            } else {
                status.textContent = "Sorry, your message could not be sent. Please try again.";
                status.style.color = "red";
            }
        } catch (error) {
            status.textContent = "Network error. Please check your connection and try again.";
            status.style.color = "red";
        }

        button.disabled = false;
        button.textContent = "Send Message";
    });
}







/* =========================================================
   GALLERY
   ========================================================= */

document
    .querySelectorAll(".gallery-item")
    .forEach(item => {

        item.addEventListener(
            "click",
            () => {

                item.classList.toggle(
                    "gallery-selected"
                );

            }
        );

    });


/* =========================================================
   CLASS ONE SALES DASHBOARD
   ========================================================= */

const salesForm =
    document.querySelector("#sales-form");

const salesList =
    document.querySelector("#sales-list");

const todaySalesList =
    document.querySelector("#today-sales-list");

const dailyList =
    document.querySelector("#daily-list");

const todayTotalElement =
    document.querySelector("#today-total");

const monthTotalElement =
    document.querySelector("#month-total");

const yearTotalElement =
    document.querySelector("#year-total");

const yearSummaryElement =
    document.querySelector("#year-summary");

const expenseForm =
    document.querySelector("#expense-form");

const expensesList =
    document.querySelector("#expenses-list");

const expenseDateInput =
    document.querySelector("#expense-date");

const saleDateInput =
    document.querySelector("#sale-date");

const historyFilter =
    document.querySelector("#history-filter");

const historySearch =
    document.querySelector("#history-search");

const historyReset =
    document.querySelector("#history-reset");

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];


/* Firestore only accepts writes from a signed-in user, so the sales page
   has to know who is signed in before it tries to save anything. */
let classOneUser = null;

/* Everything read from Firestore is kept here, so one load can redraw
   every table and total on the page. */
let allSales = [];
let allExpenses = [];

let currentDayKey = "";


/* =========================================================
   SMALL HELPERS
   ========================================================= */

function pad2(value) {
    return String(value).padStart(2, "0");
}


/* The local calendar date as YYYY-MM-DD. Using the local date (not UTC)
   means "today" rolls over at your midnight, not somewhere else. */
function localISODate(date) {
    const day = date || new Date();
    return `${day.getFullYear()}-${pad2(day.getMonth() + 1)}-${pad2(day.getDate())}`;
}


function todayKey() {
    return localISODate();
}


function parseDayKey(key) {
    const parsed = new Date(`${key}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}


function formatLongDay(key) {
    const parsed = parseDayKey(key);
    if (!parsed) return key || "No date";
    return parsed.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}


function formatShortDay(key) {
    const parsed = parseDayKey(key);
    if (!parsed) return key || "No date";
    return parsed.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}


function money(amount) {
    const value = Number(amount || 0);
    return `K${(Number.isFinite(value) ? value : 0).toFixed(2)}`;
}


function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}


function setNet(id, value) {
    const element = document.getElementById(id);
    if (!element) return;
    element.textContent = money(value);
    element.classList.toggle("positive", value > 0);
    element.classList.toggle("negative", value < 0);
}


function escapeSalesHTML(value) {
    return String(value === undefined || value === null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   NORMALISING RECORDS
   ========================================================= */

function normalizeSale(id, data) {
    const quantity = Number(data.quantity || 0);
    const price = Number(data.price || 0);

    let total = Number(data.total);
    if (!Number.isFinite(total)) total = quantity * price;

    const rawDate = String(data.date || "");
    const dateKey = /^\d{4}-\d{2}-\d{2}/.test(rawDate)
        ? rawDate.slice(0, 10)
        : "";

    let created = 0;
    if (data.createdAt && typeof data.createdAt.toDate === "function") {
        created = data.createdAt.toDate().getTime();
    }

    return {
        id: String(id),
        product: String(data.product || "Sale"),
        customer: String(data.customer || ""),
        payment: String(data.payment || "Cash"),
        quantity: quantity,
        price: price,
        total: Number.isFinite(total) ? total : 0,
        date: rawDate,
        dateKey: dateKey,
        created: created
    };
}


function normalizeExpense(id, data) {
    const rawDate = String(data.date || "");
    const dateKey = /^\d{4}-\d{2}-\d{2}/.test(rawDate)
        ? rawDate.slice(0, 10)
        : "";

    let created = 0;
    if (data.createdAt && typeof data.createdAt.toDate === "function") {
        created = data.createdAt.toDate().getTime();
    }

    return {
        id: String(id),
        description: String(data.description || "Expense"),
        category: String(data.category || "Other"),
        payment: String(data.payment || "Cash"),
        amount: Number(data.amount || 0),
        date: rawDate,
        dateKey: dateKey,
        created: created
    };
}


/* Newest day first; inside a day, newest entry first. */
function byDayThenCreated(a, b) {
    if (a.dateKey !== b.dateKey) {
        return String(b.dateKey).localeCompare(String(a.dateKey));
    }
    return b.created - a.created;
}


/* =========================================================
   DATE LABELS + "TODAY" ROLLOVER
   ========================================================= */

function refreshDateLabels() {
    const key = todayKey();
    const changed = key !== currentDayKey;
    currentDayKey = key;

    const longLabel = formatLongDay(key);

    setText("page-top-date", longLabel);
    setText("header-day", longLabel);
    setText("today-table-caption", `Sales recorded for ${longLabel}.`);

    if (saleDateInput) {
        /* Never allow a sale dated in the future: it would not belong to
           any real trading day. */
        saleDateInput.max = key;
        if (!saleDateInput.value) saleDateInput.value = key;
    }

    return changed;
}


if (expenseDateInput) expenseDateInput.value = localISODate();

refreshDateLabels();


/* A page left open past midnight should start a fresh "today" instead of
   quietly adding the new day's sales to the previous day's total. */
setInterval(() => {
    if (todayKey() === currentDayKey) return;

    refreshDateLabels();

    if (saleDateInput) saleDateInput.value = todayKey();
    if (expenseDateInput && !expenseDateInput.value) {
        expenseDateInput.value = localISODate();
    }

    if (classOneUser) {
        loadDashboard();
    } else {
        renderDashboard();
    }
}, 60000);


/* =========================================================
   LOADING
   ========================================================= */

async function loadDashboard() {

    if (!salesForm && !expenseForm) return;

    try {

        const [salesSnapshot, expensesSnapshot] = await Promise.all([
            getDocs(collection(db, "sales")),
            getDocs(collection(db, "expenses"))
        ]);

        allSales = salesSnapshot.docs.map((saleDoc) =>
            normalizeSale(saleDoc.id, saleDoc.data())
        );

        allExpenses = expensesSnapshot.docs.map((expenseDoc) =>
            normalizeExpense(expenseDoc.id, expenseDoc.data())
        );

        renderDashboard();

    } catch (error) {

        console.error("DASHBOARD LOAD ERROR:", error);

        const row = `
            <tr class="empty">
                <td colspan="8">
                    Unable to load records. ${escapeSalesHTML(error.message)}
                </td>
            </tr>
        `;

        [salesList, todaySalesList].forEach((body) => {
            if (body) body.innerHTML = row;
        });

        if (expensesList) {
            expensesList.innerHTML = `
                <tr class="empty">
                    <td colspan="6">
                        Unable to load expenses. ${escapeSalesHTML(error.message)}
                    </td>
                </tr>
            `;
        }

        if (dailyList) {
            dailyList.innerHTML = `
                <tr class="empty"><td colspan="7">Unable to load days.</td></tr>
            `;
        }

        setMoneyCardsToZero();
    }
}


function setMoneyCardsToZero() {
    [
        "today-total", "today-average", "today-expenses", "today-net",
        "month-total", "month-expenses", "month-net",
        "year-total", "year-expenses", "year-net",
        "today-footer-total"
    ].forEach((id) => setText(id, money(0)));

    setText("today-count", "0");
    setText("today-items", "0");

    MONTH_NAMES.forEach((month) => setText(month, money(0)));
}


/* =========================================================
   RENDER EVERYTHING
   ========================================================= */

function renderDashboard() {

    refreshDateLabels();

    const today = todayKey();
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const days = new Map();

    function dayEntry(key) {
        if (!days.has(key)) {
            days.set(key, {
                key: key,
                sales: 0,
                items: 0,
                count: 0,
                expenses: 0,
                net: 0
            });
        }
        return days.get(key);
    }

    let todayTotal = 0;
    let todayItems = 0;
    let todayCount = 0;
    let monthSales = 0;
    let yearSales = 0;

    const monthlyTotals = {};
    MONTH_NAMES.forEach((month) => { monthlyTotals[month] = 0; });

    allSales.forEach((sale) => {

        if (!sale.dateKey) return;

        const entry = dayEntry(sale.dateKey);
        entry.sales += sale.total;
        entry.items += sale.quantity;
        entry.count += 1;
        entry.net += sale.total;

        if (sale.dateKey === today) {
            todayTotal += sale.total;
            todayItems += sale.quantity;
            todayCount += 1;
        }

        const parsed = parseDayKey(sale.dateKey);
        if (parsed && parsed.getFullYear() === currentYear) {
            yearSales += sale.total;
            monthlyTotals[MONTH_NAMES[parsed.getMonth()]] += sale.total;
            if (parsed.getMonth() === currentMonth) {
                monthSales += sale.total;
            }
        }
    });

    let todayExpenses = 0;
    let monthExpenses = 0;
    let yearExpenses = 0;

    allExpenses.forEach((expense) => {

        if (!expense.dateKey) return;

        const entry = dayEntry(expense.dateKey);
        entry.expenses += expense.amount;
        entry.net -= expense.amount;

        if (expense.dateKey === today) todayExpenses += expense.amount;

        const parsed = parseDayKey(expense.dateKey);
        if (parsed && parsed.getFullYear() === currentYear) {
            yearExpenses += expense.amount;
            if (parsed.getMonth() === currentMonth) {
                monthExpenses += expense.amount;
            }
        }
    });

    /* ---------- TODAY PANEL ---------- */

    setText("today-total", money(todayTotal));
    setText("today-count", String(todayCount));
    setText("today-items", String(todayItems));
    setText(
        "today-average",
        money(todayCount ? todayTotal / todayCount : 0)
    );
    setText("today-expenses", money(todayExpenses));
    setNet("today-net", todayTotal - todayExpenses);

    /* ---------- PERIOD CARDS ---------- */

    setText("month-total", money(monthSales));
    setText("month-expenses", money(monthExpenses));
    setNet("month-net", monthSales - monthExpenses);

    setText("year-total", money(yearSales));
    setText("year-expenses", money(yearExpenses));
    setNet("year-net", yearSales - yearExpenses);

    setText("year-summary", `${currentYear}: ${money(yearSales)}`);

    /* ---------- MONTH GRID ---------- */

    MONTH_NAMES.forEach((month) => {
        setText(month, money(monthlyTotals[month]));
    });

    /* ---------- TABLES ---------- */

    const sortedDays = [...days.values()].sort(
        (a, b) => b.key.localeCompare(a.key)
    );

    renderTodaySales(todayTotal);
    renderDailyBreakdown(sortedDays);
    renderHistoryOptions(sortedDays);
    renderHistory();
    renderExpenses();
}


/* =========================================================
   TODAY'S SALES TABLE
   ========================================================= */

function renderTodaySales(todayTotal) {

    if (!todaySalesList) return;

    const today = todayKey();

    const todaysSales = allSales
        .filter((sale) => sale.dateKey === today)
        .sort(byDayThenCreated);

    setText("today-table-total", `${todaysSales.length} record(s)`);
    setText("today-footer-total", money(todayTotal));

    if (!todaysSales.length) {
        todaySalesList.innerHTML = `
            <tr class="empty">
                <td colspan="7">
                    No sales recorded today yet. Add the first sale above.
                </td>
            </tr>
        `;
        return;
    }

    todaySalesList.innerHTML = todaysSales
        .map((sale) => `
            <tr>
                <td>${escapeSalesHTML(sale.product)}</td>
                <td>${escapeSalesHTML(sale.customer || "Walk-in Customer")}</td>
                <td class="num">${sale.quantity}</td>
                <td class="num">${money(sale.price)}</td>
                <td class="num money">${money(sale.total)}</td>
                <td><span class="badge">${escapeSalesHTML(sale.payment)}</span></td>
                <td>
                    <button type="button" class="btn-delete delete-sale"
                        data-id="${escapeSalesHTML(sale.id)}">Delete</button>
                </td>
            </tr>
        `)
        .join("");
}


/* =========================================================
   SALES BY DAY
   ========================================================= */

function renderDailyBreakdown(sortedDays) {

    if (!dailyList) return;

    const today = todayKey();

    setText(
        "daily-rows-count",
        sortedDays.length
            ? `${sortedDays.length} day(s) recorded`
            : ""
    );

    if (!sortedDays.length) {
        dailyList.innerHTML = `
            <tr class="empty">
                <td colspan="7">No trading days recorded yet.</td>
            </tr>
        `;
        return;
    }

    dailyList.innerHTML = sortedDays
        .map((day) => {

            const isToday = day.key === today;

            return `
                <tr>
                    <td>
                        ${escapeSalesHTML(formatShortDay(day.key))}
                        ${isToday ? '<span class="badge badge-today">Today</span>' : ""}
                    </td>
                    <td class="num">${day.count}</td>
                    <td class="num">${day.items}</td>
                    <td class="num money">${money(day.sales)}</td>
                    <td class="num">${money(day.expenses)}</td>
                    <td class="num ${day.net > 0 ? "positive" : day.net < 0 ? "negative" : ""}">${money(day.net)}</td>
                    <td>
                        <button type="button" class="btn-link view-day" data-day="${escapeSalesHTML(day.key)}">
                            View records
                        </button>
                    </td>
                </tr>
            `;
        })
        .join("");
}


/* =========================================================
   SALES HISTORY + FILTER
   ========================================================= */

function renderHistoryOptions(sortedDays) {

    if (!historyFilter) return;

    const previous = historyFilter.value || "all";

    const options = ['<option value="all">All dates</option>'];

    sortedDays.forEach((day) => {
        options.push(
            `<option value="${escapeSalesHTML(day.key)}">` +
            `${escapeSalesHTML(formatShortDay(day.key))} — ${money(day.sales)}</option>`
        );
    });

    historyFilter.innerHTML = options.join("");

    const stillThere = [...historyFilter.options]
        .some((option) => option.value === previous);

    historyFilter.value = stillThere ? previous : "all";
}


function renderHistory() {

    if (!salesList) return;

    const today = todayKey();
    const filterValue = historyFilter ? historyFilter.value : "all";
    const search = historySearch
        ? historySearch.value.trim().toLowerCase()
        : "";

    const rows = allSales
        .filter((sale) => {
            if (filterValue !== "all" && sale.dateKey !== filterValue) {
                return false;
            }
            if (!search) return true;
            return (
                sale.product.toLowerCase().includes(search) ||
                sale.customer.toLowerCase().includes(search)
            );
        })
        .sort(byDayThenCreated);

    const filteredTotal = rows.reduce((sum, sale) => sum + sale.total, 0);

    setText(
        "history-summary",
        `${rows.length} record(s) · ${money(filteredTotal)}`
    );

    if (!rows.length) {
        salesList.innerHTML = `
            <tr class="empty">
                <td colspan="8">No sales match this filter.</td>
            </tr>
        `;
        return;
    }

    salesList.innerHTML = rows
        .map((sale) => `
            <tr>
                <td>
                    ${escapeSalesHTML(sale.dateKey ? formatShortDay(sale.dateKey) : "No date")}
                    ${sale.dateKey === today ? '<span class="badge badge-today">Today</span>' : ""}
                </td>
                <td>${escapeSalesHTML(sale.product)}</td>
                <td>${escapeSalesHTML(sale.customer || "Walk-in Customer")}</td>
                <td class="num">${sale.quantity}</td>
                <td class="num">${money(sale.price)}</td>
                <td class="num money">${money(sale.total)}</td>
                <td><span class="badge">${escapeSalesHTML(sale.payment)}</span></td>
                <td>
                    <button type="button" class="btn-delete delete-sale"
                        data-id="${escapeSalesHTML(sale.id)}">Delete</button>
                </td>
            </tr>
        `)
        .join("");
}


if (historyFilter) {
    historyFilter.addEventListener("change", renderHistory);
}

if (historySearch) {
    historySearch.addEventListener("input", renderHistory);
}

if (historyReset) {
    historyReset.addEventListener("click", () => {
        if (historyFilter) historyFilter.value = "all";
        if (historySearch) historySearch.value = "";
        renderHistory();
    });
}


/* =========================================================
   EXPENSE RECORDS
   ========================================================= */

function renderExpenses() {

    if (!expensesList) return;

    const rows = [...allExpenses].sort(byDayThenCreated);
    const total = rows.reduce((sum, expense) => sum + expense.amount, 0);

    setText(
        "expenses-summary",
        `${rows.length} record(s) · ${money(total)}`
    );

    if (!rows.length) {
        expensesList.innerHTML = `
            <tr class="empty">
                <td colspan="6">No expenses recorded yet.</td>
            </tr>
        `;
        return;
    }

    expensesList.innerHTML = rows
        .map((expense) => `
            <tr>
                <td>${escapeSalesHTML(expense.dateKey ? formatShortDay(expense.dateKey) : "No date")}</td>
                <td>${escapeSalesHTML(expense.description)}</td>
                <td><span class="badge">${escapeSalesHTML(expense.category)}</span></td>
                <td class="num money">${money(expense.amount)}</td>
                <td>${escapeSalesHTML(expense.payment)}</td>
                <td>
                    <button type="button" class="btn-delete delete-expense"
                        data-id="${escapeSalesHTML(expense.id)}">Delete</button>
                </td>
            </tr>
        `)
        .join("");
}


/* =========================================================
   ADD SALE
   ========================================================= */

/* Friendly explanation when Firestore refuses a write. */
function firestoreWriteHint(error) {

    const code = error && error.code ? String(error.code) : "";
    const message = error && error.message ? String(error.message) : "";

    if (
        code === "permission-denied" ||
        /missing or insufficient permissions/i.test(message)
    ) {
        return (
            "\n\nYou are not allowed to write to the Firestore database.\n" +
            "Sign in to Class One first, and check that your Firestore " +
            "security rules allow create access for signed-in users."
        );
    }

    if (
        code === "unavailable" ||
        /network|offline|timeout/i.test(message)
    ) {
        return "\n\nFirebase could not be reached. Check your internet connection and try again.";
    }

    return "";
}


if (salesForm) {
    salesForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        if (!classOneUser) {
            alert("Please log in to Class One before recording a sale.");
            window.location.href = "login.html";
            return;
        }

        const saveButton = salesForm.querySelector('button[type="submit"]');

        const product = document.getElementById("sale-product").value.trim();
        const customer = document.getElementById("sale-customer").value.trim();
        const quantity = Number(document.getElementById("sale-quantity").value);
        const price = Number(document.getElementById("sale-price").value);
        const payment = document.getElementById("sale-payment").value;
        const date = document.getElementById("sale-date").value;

        if (
            !product ||
            !date ||
            !Number.isFinite(quantity) ||
            quantity < 1 ||
            !Number.isFinite(price) ||
            price <= 0
        ) {
            alert("Please fill in Product, Quantity, Price and Date.");
            return;
        }

        if (date > todayKey()) {
            alert("The sale date cannot be in the future. Choose today or an earlier date.");
            return;
        }

        saveButton.disabled = true;
        saveButton.textContent = "Saving...";

        try {
            await addDoc(collection(db, "sales"), {
                product: product,
                customer: customer,
                quantity: quantity,
                price: price,
                total: quantity * price,
                payment: payment,
                date: date,
                createdAt: new Date()
            });

            const savedForToday = date === todayKey();

            alert(
                savedForToday
                    ? "✅ Sale recorded in today's sales!"
                    : `✅ Sale recorded for ${formatShortDay(date)}.`
            );

            salesForm.reset();
            if (saleDateInput) saleDateInput.value = todayKey();
            document.getElementById("sale-quantity").value = "1";

            await loadDashboard();

        } catch (error) {
            console.error("SALE ERROR:", error);

            alert(
                "❌ Sale was NOT recorded.\n\n" +
                "Error: " + (error.message || error) +
                firestoreWriteHint(error)
            );
        } finally {
            /* Always give the button back, otherwise the form stops working
               after a single failed attempt. */
            saveButton.disabled = false;
            saveButton.textContent = "Add Sale Record";
        }
    });
}


/* =========================================================
   ADD EXPENSE
   ========================================================= */

if (expenseForm) {
    expenseForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        if (!classOneUser) {
            alert("Please log in to Class One before recording an expense.");
            window.location.href = "login.html";
            return;
        }

        const description = document.getElementById("expense-description").value.trim();
        const amount = Number(document.getElementById("expense-amount").value);
        const category = document.getElementById("expense-category").value;
        const date = document.getElementById("expense-date").value;
        const payment = document.getElementById("expense-payment").value;

        if (!description || !date || !Number.isFinite(amount) || amount <= 0) {
            alert("Please enter a description, valid amount and date.");
            return;
        }

        const saveButton = expenseForm.querySelector('button[type="submit"]');
        saveButton.disabled = true;
        saveButton.textContent = "Saving...";

        try {
            await addDoc(collection(db, "expenses"), {
                description: description,
                amount: amount,
                category: category,
                date: date,
                payment: payment,
                createdAt: new Date()
            });

            alert("Expense saved successfully.");

            expenseForm.reset();
            if (expenseDateInput) expenseDateInput.value = localISODate();

            await loadDashboard();

        } catch (error) {
            console.error("EXPENSE SAVE ERROR:", error);
            alert(
                "Expense was not saved. Check your internet connection and Firestore rules.\n\n" +
                error.message
            );
        } finally {
            saveButton.disabled = false;
            saveButton.textContent = "Save Expense";
        }
    });
}


/* =========================================================
   DELETE RECORDS (delegated, so it works for every table)
   ========================================================= */

document.addEventListener("click", async (event) => {

    const deleteSaleButton = event.target.closest(".delete-sale");
    const deleteExpenseButton = event.target.closest(".delete-expense");
    const viewDayButton = event.target.closest(".view-day");

    if (viewDayButton) {
        const day = viewDayButton.dataset.day || "all";
        if (historyFilter) {
            historyFilter.value = day;
            renderHistory();
        }
        const historyCard = salesList ? salesList.closest(".card") : null;
        if (historyCard) historyCard.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
    }

    if (deleteSaleButton) {

        const saleId = deleteSaleButton.dataset.id;

        if (!confirm("Delete this sales record? This cannot be undone.")) return;

        deleteSaleButton.disabled = true;

        try {
            await deleteDoc(doc(db, "sales", saleId));
            await loadDashboard();

        } catch (error) {
            console.error("SALE DELETE ERROR:", error);
            alert(
                "Unable to delete this sales record.\n\n" + error.message +
                firestoreWriteHint(error)
            );
            deleteSaleButton.disabled = false;
        }

        return;
    }

    if (deleteExpenseButton) {

        const expenseId = deleteExpenseButton.dataset.id;

        if (!confirm("Delete this expense record? This cannot be undone.")) return;

        deleteExpenseButton.disabled = true;

        try {
            await deleteDoc(doc(db, "expenses", expenseId));
            await loadDashboard();

        } catch (error) {
            console.error("EXPENSE DELETE ERROR:", error);
            alert(
                "Unable to delete this expense.\n\n" + error.message +
                firestoreWriteHint(error)
            );
            deleteExpenseButton.disabled = false;
        }
    }
});


/* =========================================================
   WEBSITE LOADED + AUTHENTICATION
   ========================================================= */

console.log(
    "Class One website JavaScript loaded successfully."
);


function applySalesAuthState(user) {

    const authNotice = document.getElementById("auth-notice");

    if (authNotice) authNotice.hidden = !!user;

    if (user) {
        loadDashboard();
        return;
    }

    if (todaySalesList) {
        todaySalesList.innerHTML =
            '<tr class="empty"><td colspan="7">Log in to Class One to see today\'s sales.</td></tr>';
    }

    if (salesList) {
        salesList.innerHTML =
            '<tr class="empty"><td colspan="8">Log in to Class One to see sales records.</td></tr>';
    }

    if (dailyList) {
        dailyList.innerHTML =
            '<tr class="empty"><td colspan="7">Log in to Class One to see daily totals.</td></tr>';
    }

    if (expensesList) {
        expensesList.innerHTML =
            '<tr class="empty"><td colspan="6">Log in to Class One to see expenses.</td></tr>';
    }

    setMoneyCardsToZero();
}


if (salesForm || expenseForm) {

    onAuthStateChanged(auth, (user) => {

        classOneUser = user;

        applySalesAuthState(user);

    });

}
