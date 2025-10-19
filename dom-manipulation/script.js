/* script.js
   - localStorage for persistent quotes
   - sessionStorage to remember last viewed quote index in current session
   - import/export JSON (Blob + FileReader)
*/

// --- Constants for storage keys
const LOCAL_STORAGE_KEY = "dynamicQuoteGenerator_quotes_v1";
const SESSION_LAST_INDEX_KEY = "dynamicQuoteGenerator_lastIndex_v1";

// --- Default quotes (used if localStorage is empty)
const DEFAULT_QUOTES = [
  { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Perseverance" }
];

// --- DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const confirmAddBtn = document.getElementById("confirmAddBtn");
const exportBtn = document.getElementById("exportBtn");
const importFileInput = document.getElementById("importFile");
const newTextInput = document.getElementById("newQuoteText");
const newCategoryInput = document.getElementById("newQuoteCategory");

// --- In-memory quotes array (will be loaded from localStorage)
let quotes = [];

/* ---------- Storage helpers ---------- */
function saveQuotes() {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
  } catch (e) {
    console.error("Failed to save to localStorage", e);
  }
}

function loadQuotes() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      quotes = [...DEFAULT_QUOTES];
      saveQuotes();
      return;
    }
    const parsed = JSON.parse(raw);
    // Basic validation: must be array of objects with text & category
    if (Array.isArray(parsed)) {
      const valid = parsed.filter(q => q && typeof q.text === "string" && typeof q.category === "string");
      quotes = valid.length ? valid : [...DEFAULT_QUOTES];
    } else {
      quotes = [...DEFAULT_QUOTES];
    }
  } catch (e) {
    console.error("Error loading quotes from localStorage:", e);
    quotes = [...DEFAULT_QUOTES];
  }
}

/* sessionStorage: remember last shown index during session */
function saveLastViewedIndex(index) {
  try {
    sessionStorage.setItem(SESSION_LAST_INDEX_KEY, String(index));
  } catch (e) {
    console.warn("Could not save last index to sessionStorage", e);
  }
}
function loadLastViewedIndex() {
  const v = sessionStorage.getItem(SESSION_LAST_INDEX_KEY);
  if (v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(0, Math.min(n, quotes.length - 1)) : null;
}

/* ---------- Display helpers ---------- */
function updateDisplay(quoteObj, index = null) {
  if (!quoteObj) {
    quoteDisplay.textContent = "No quotes available. Add one below!";
    return;
  }
  quoteDisplay.textContent = `"${quoteObj.text}" — [${quoteObj.category}]`;
  if (index !== null) saveLastViewedIndex(index);
}

/* ---------- Core functions (must match project names) ---------- */
function showRandomQuote() {
  if (!Array.isArray(quotes) || quotes.length === 0) {
    updateDisplay(null);
    return;
  }
  // Prefer showing the last viewed (session) on first load if available
  const lastIndex = loadLastViewedIndex();
  if (lastIndex !== null && lastIndex >= 0 && lastIndex < quotes.length) {
    updateDisplay(quotes[lastIndex], lastIndex);
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  updateDisplay(quotes[randomIndex], randomIndex);
}

function addQuote() {
  // This function is used by the UI when user clicks confirm add
  const newText = newTextInput.value.trim();
  const newCategory = newCategoryInput.value.trim();

  if (!newText || !newCategory) {
    alert("Please enter both quote text and category.");
    return;
  }

  const newQuote = { text: newText, category: newCategory };
  quotes.push(newQuote);
  saveQuotes();

  // clear inputs and show confirmation in display
  newTextInput.value = "";
  newCategoryInput.value = "";
  updateDisplay(newQuote, quotes.length - 1);
  alert("Quote added and saved to localStorage.");
}

/* ---------- Import and Export JSON ---------- */
function exportToJson() {
  try {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Create a temporary link and trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes-export.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error("Export failed:", e);
    alert("Export failed. See console for details.");
  }
}

function importFromJsonFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (ev) {
    try {
      const imported = JSON.parse(ev.target.result);
      if (!Array.isArray(imported)) throw new Error("Imported JSON must be an array of quotes.");

      // Filter & validate imported objects (text & category as strings)
      const valid = imported.filter(q => q && typeof q.text === "string" && typeof q.category === "string");
      if (valid.length === 0) {
        alert("No valid quote objects found in file (need {text: string, category: string}).");
        return;
      }

      // append imported quotes (avoid adding exact duplicates by text+category)
      const added = [];
      valid.forEach(q => {
        const exists = quotes.some(existing => existing.text === q.text && existing.category === q.category);
        if (!exists) {
          quotes.push(q);
          added.push(q);
        }
      });

      if (added.length > 0) {
        saveQuotes();
        alert(`Imported ${added.length} new quote(s).`);
        // show last imported quote
        updateDisplay(quotes[quotes.length - 1], quotes.length - 1);
      } else {
        alert("No new quotes to import (duplicates were ignored).");
      }
    } catch (err) {
      console.error("Import error:", err);
      alert("Failed to import JSON file. Make sure it is valid and has an array of {text, category} objects.");
    } finally {
      // reset the input so same file can be re-uploaded if needed
      importFileInput.value = "";
    }
  };

  reader.onerror = function () {
    alert("Failed to read file.");
    importFileInput.value = "";
  };

  reader.readAsText(file);
}

/* ---------- Initialization & Event listeners ---------- */
function init() {
  loadQuotes();
  // show last viewed if available, else a random one
  const lastIndex = loadLastViewedIndex();
  if (lastIndex !== null && lastIndex >= 0 && lastIndex < quotes.length) {
    updateDisplay(quotes[lastIndex], lastIndex);
  } else {
    showRandomQuote();
  }

  // Event listeners
  newQuoteBtn.addEventListener("click", showRandomQuote);
  addQuoteBtn.addEventListener("click", () => {
    // reveal the small add form (we already have the inputs visible but keep UX simple)
    newTextInput.focus();
  });
  confirmAddBtn.addEventListener("click", addQuote);
  exportBtn.addEventListener("click", exportToJson);
  importFileInput.addEventListener("change", importFromJsonFile);
}

// Run init on page load
init();
