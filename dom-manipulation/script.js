// ========== GLOBAL VARIABLES ==========
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const notification = document.getElementById("notification");

// ========== DISPLAY RANDOM QUOTE ==========
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available.";
    return;
  }
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteDisplay.innerHTML = `"${randomQuote.text}" - <em>${randomQuote.category}</em>`;
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

// ========== ADD NEW QUOTE ==========
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    showNotification("✅ New quote added successfully!");
  } else {
    alert("Please enter both quote and category.");
  }
}

// ========== SAVE QUOTES TO LOCAL STORAGE ==========
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ========== POPULATE CATEGORIES ==========
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = categories
    .map(cat => `<option value="${cat}">${cat}</option>`)
    .join("");

  const savedCategory = localStorage.getItem("selectedCategory") || "all";
  categoryFilter.value = savedCategory;
}

// ========== FILTER QUOTES ==========
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);

  const filtered =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  if (filtered.length > 0) {
    const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
    quoteDisplay.innerHTML = `"${randomQuote.text}" - <em>${randomQuote.category}</em>`;
  } else {
    quoteDisplay.innerHTML = "No quotes found for this category.";
  }
}

// ========== IMPORT QUOTES FROM JSON ==========
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    showNotification("📥 Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// ========== EXPORT QUOTES TO JSON ==========
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "quotes.json";
  link.click();
}

// ========== FETCH QUOTES FROM SERVER ==========
async function fetchQuotesFromServer() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
  const data = await response.json();
  return data.map(post => ({
    text: post.title,
    category: "Server"
  }));
}

// ========== POST QUOTE TO SERVER ==========
async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });
    return await response.json();
  } catch (err) {
    console.error("Failed to post quote:", err);
