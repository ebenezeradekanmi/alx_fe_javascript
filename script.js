// --- Initial Quotes Array ---
const quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { text: "Do what you can, with what you have, where you are.", category: "Inspiration" }
];

// --- DOM Elements ---
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const quoteTextInput = document.getElementById("newQuoteText");
const quoteCategoryInput = document.getElementById("newQuoteCategory");

// --- Function to Display Random Quote ---
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available. Add one below!";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.textContent = `"${randomQuote.text}" — [${randomQuote.category}]`;
}

// --- Function to Add a New Quote Dynamically ---
function addQuote() {
  const text = quoteTextInput.value.trim();
  const category = quoteCategoryInput.value.trim();

  if (!text || !category) {
    alert("Please fill in both the quote and category fields.");
    return;
  }

  // Create a new quote object and add it to the array
  const newQuote = { text, category };
  quotes.push(newQuote);

  // Clear inputs
  quoteTextInput.value = "";
  quoteCategoryInput.value = "";

  // Update UI
  quoteDisplay.textContent = `New quote added! "${newQuote.text}" — [${newQuote.category}]`;
}

// --- Event Listeners ---
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
