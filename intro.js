document.addEventListener("DOMContentLoaded", () => {
  const journalForm = document.getElementById("journalForm");
  const continueContainer = document.getElementById("continueContainer");
  const continueButton = document.getElementById("continueButton");

  // Check if there is an ongoing journal
  const startDate = localStorage.getItem("journalStartDate");
  const endDate = localStorage.getItem("journalEndDate");
  const goalName = localStorage.getItem("goalName"); // Retrieve the journal name

  if (startDate && endDate && goalName) {
    // Show continue button if a journal exists
    continueContainer.style.display = "block";
    // Update the continue button text with the journal name
    continueButton.textContent = `Continue "${goalName}"`;
  }

  journalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const endDateValue = document.getElementById("endDate").value;
    const startDateValue = new Date().toISOString().split("T")[0];
    const goalNameValue = document.getElementById("goalName").value; // Get the journal name

    // Save start and end dates and goal name to localStorage
    localStorage.setItem("journalStartDate", startDateValue);
    localStorage.setItem("journalEndDate", endDateValue);
    localStorage.setItem("goalName", goalNameValue); // Save the journal name

    // Redirect to the main journaling page
    window.location.href = "journal.html";
  });

  continueButton.addEventListener("click", () => {
    // Redirect to the main journaling page
    window.location.href = "journal.html";
  });

  const quotes = [
    "The journey of a thousand miles begins with a single step. — Lao Tzu",
    "Your life does not get better by chance, it gets better by change. — Jim Rohn",
    "It's never too late to be what you might have been. — George Eliot",
    "Today is the first day of the rest of your life.",
    "The only impossible journey is the one you never begin. — Tony Robbins",
    "Change your life today. Don’t gamble on the future, act now, without delay. — Simone de Beauvoir",
    "You are never too old to set another goal or to dream a new dream. — C.S. Lewis",
    "What lies behind us and what lies before us are tiny matters compared to what lies within us. — Ralph Waldo Emerson",
    "Your second chance may be your best chance.",
    "Rise up and start anew; the future is in your hands.",
  ];

  function displayQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteDisplay.textContent = quotes[randomIndex];
  }

  // Change quote every 15 seconds
  setInterval(displayQuote, 15000);
  displayQuote(); // Initial call to display a quote immediately
});
