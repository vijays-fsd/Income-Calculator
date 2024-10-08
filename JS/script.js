// Selectors
const entryForm = document.getElementById("entry-form");
const entriesList = document.getElementById("entries-list");
const totalIncomeElement = document.getElementById("total-income");
const totalExpenseElement = document.getElementById("total-expense");
const netBalanceElement = document.getElementById("net-balance");
const filters = document.querySelectorAll('input[name="filter"]');

// Variables
let entries = JSON.parse(localStorage.getItem("entries")) || [];

// Functions
function addEntry(e) {
  e.preventDefault();

  const description = document.getElementById("description").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const type = document.querySelector('input[name="type"]:checked').value;

  const entry = { id: Date.now(), description, amount, type };
  entries.push(entry);

  saveEntries();
  updateUI();
  entryForm.reset();
}

function saveEntries() {
  localStorage.setItem("entries", JSON.stringify(entries));
}

function updateUI() {
  entriesList.innerHTML = "";

  const filteredEntries = getFilteredEntries();

  filteredEntries.forEach((entry) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <span>${entry.description}</span>
            <span>₹${entry.amount.toFixed(2)}</span>
            <button onclick="editEntry(${entry.id})">Edit</button>
            <button onclick="deleteEntry(${entry.id})">Delete</button>
        `;
    entriesList.appendChild(li);
  });

  updateSummary();
}

function getFilteredEntries() {
  const selectedFilter = document.querySelector(
    'input[name="filter"]:checked'
  ).value;

  if (selectedFilter === "all") return entries;
  return entries.filter((entry) => entry.type === selectedFilter);
}

function deleteEntry(id) {
  entries = entries.filter((entry) => entry.id !== id);
  saveEntries();
  updateUI();
}

function editEntry(id) {
  const entry = entries.find((entry) => entry.id === id);
  document.getElementById("description").value = entry.description;
  document.getElementById("amount").value = entry.amount;
  document.querySelector(
    `input[name="type"][value="${entry.type}"]`
  ).checked = true;

  deleteEntry(id); // Remove the old entry before saving the updated one
}

function updateSummary() {
  const income = entries
    .filter((entry) => entry.type === "income")
    .reduce((acc, entry) => acc + entry.amount, 0);

  const expense = entries
    .filter((entry) => entry.type === "expense")
    .reduce((acc, entry) => acc + entry.amount, 0);

  const netBalance = income - expense;

  totalIncomeElement.textContent = `₹${income.toFixed(2)}`;
  totalExpenseElement.textContent = `₹${expense.toFixed(2)}`;
  netBalanceElement.textContent = `₹${netBalance.toFixed(2)}`;
}

// Event Listeners
entryForm.addEventListener("submit", addEntry);
filters.forEach((filter) => filter.addEventListener("change", updateUI));

// Initial Load
updateUI();
