// Initial quotes array with text and category
const quotes = [
  { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Perseverance" }
];

// Get references to DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");

// Function to show a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available. Add one below!";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.textContent = `"${randomQuote.text}" — (${randomQuote.category})`;
}

// Function to add a new quote
function addQuote() {
  const newText = document.getElementById("newQuoteText").value.trim();
  const newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newText && newCategory) {
    const newQuote = { text: newText, category: newCategory };
    quotes.push(newQuote);
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    quoteDisplay.textContent = "✅ New quote added successfully!";
  } else {
    quoteDisplay.textContent = "⚠️ Please enter both quote text and category.";
  }
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
