// -------------------------------
// Initialization & Local Data
// -------------------------------
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" }
];

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// -------------------------------
// Display Logic
// -------------------------------
function displayRandomQuote() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selectedCategory = categoryFilter.value;

  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = "No quotes available.";
    return;
  }

  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  document.getElementById("quoteDisplay").innerHTML =
    `"${randomQuote.text}" <br><em>(${randomQuote.category})</em>`;
}

// -------------------------------
// Add Quote Logic
// -------------------------------
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please fill in both fields.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  displayNotification("New quote added locally.");
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// -------------------------------
// Category Management
// -------------------------------
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const saved = localStorage.getItem("selectedCategory");
  if (saved && [...categoryFilter.options].some(o => o.value === saved)) {
    categoryFilter.value = saved;
  }
}

function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);
  displayRandomQuote();
}

// -------------------------------
// Notification UI
// -------------------------------
function displayNotification(message, duration = 3000) {
  const notif = document.getElementById("notification");
  notif.textContent = message;
  notif.style.display = "block";
  setTimeout(() => notif.style.display = "none", duration);
}

// -------------------------------
// Server Simulation (Sync)
// -------------------------------
async function fetchServerQuotes() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const data = await response.json();

    // Convert posts into mock quotes
    return data.map(item => ({
      text: item.title,
      category: "Server"
    }));
  } catch (error) {
    console.error("Failed to fetch server quotes:", error);
    return [];
  }
}

async function syncQuotes() {
  displayNotification("Syncing with server...");
  const serverQuotes = await fetchServerQuotes();

  let newQuotes = 0;
  let conflicts = 0;

  serverQuotes.forEach(serverQuote => {
    const exists = quotes.some(local => local.text === serverQuote.text);
    if (!exists) {
      quotes.push(serverQuote);
      newQuotes++;
    } else {
      conflicts++;
    }
  });

  if (newQuotes > 0) {
    saveQuotes();
    populateCategories();
  }

  if (newQuotes > 0 && conflicts > 0)
    displayNotification(`Sync complete: ${newQuotes} new quotes, ${conflicts} conflicts resolved.`);
  else if (newQuotes > 0)
    displayNotification(`${newQuotes} new quotes added from server.`);
  else
    displayNotification("No new updates found.");
}

// -------------------------------
// Initialization
// -------------------------------
function init() {
  populateCategories();
  const saved = localStorage.getItem("selectedCategory");
  if (saved) document.getElementById("categoryFilter").value = saved;
  displayRandomQuote();

  document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
  document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
  document.getElementById("syncBtn").addEventListener("click", syncQuotes);

  // Auto-sync every 60 seconds (simulation)
  setInterval(syncQuotes, 60000);
}

document.addEventListener("DOMContentLoaded", init);


