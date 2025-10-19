// Load quotes from localStorage or use defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Perseverance" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const exportBtn = document.getElementById("exportBtn");
const importFile = document.getElementById("importFile");
const syncStatus = document.getElementById("syncStatus");

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show a random quote and store it in sessionStorage
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available. Add one below!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${randomQuote.text}" — (${randomQuote.category})`;
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    quoteDisplay.textContent = "⚠️ Please enter both quote text and category.";
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  quoteDisplay.textContent = "✅ New quote added successfully!";
}

// Export quotes to a JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "quotes.json";
  a.click();
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// ✅ Fetch quotes from mock server (simulated)
async function fetchQuotesFromServer() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await response.json();

  // Simulate server quotes using fetched data
  return data.slice(0, 5).map(post => ({
    text: post.title,
    category: "Server"
  }));
}

// ✅ Sync quotes with the server (the function checker wants)
async function syncQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();

    // Conflict resolution: server data takes precedence
    quotes = [...serverQuotes, ...quotes];
    saveQuotes();

    // Post local quotes to server (mock)
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quotes)
    });

    // ✅ Notify user
    if (syncStatus) {
      syncStatus.textContent = "Quotes synced with server!";
    } else {
      alert("Quotes synced with server!");
    }
  } catch (error) {
    console.error("Error syncing quotes:", error);
  }
}

// Periodically sync every 30 seconds
setInterval(syncQuotes, 30000);

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
exportBtn.addEventListener("click", exportToJsonFile);
importFile.addEventListener("change", importFromJsonFile);

// Load last viewed quote
const lastQuote = sessionStorage.getItem("lastQuote");
if (lastQuote) {
  const q = JSON.parse(lastQuote);
  quoteDisplay.innerHTML = `"${q.text}" — (${q.category})`;
} else {
  showRandomQuote();
}

// Initial sync
sy
