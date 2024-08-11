document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid");
  const popup = document.getElementById("popup");
  const overlay = document.getElementById("overlay");
  let currentSquare = null;

  // Get start and end dates from localStorage
  const startDate = new Date(localStorage.getItem("journalStartDate"));
  const endDate = new Date(localStorage.getItem("journalEndDate"));
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  const dates = Array.from({ length: totalDays }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return {
      dateString: date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      dayString: date.toLocaleDateString(undefined, { weekday: "short" }),
      date: date,
    };
  });

  for (let i = 0; i < totalDays; i++) {
    const square = document.createElement("div");
    square.className = "square";
    square.dataset.index = i;

    const savedColor = localStorage.getItem(`square-${i}`);
    const savedJournal = localStorage.getItem(`journal-${i}`);

    if (dates[i].date < today) {
      square.classList.add("crossed");
    }

    if (savedColor) {
      square.classList.add(savedColor);
    }

    square.innerHTML = `${dates[i].dateString}<br>${dates[i].dayString}`;
    square.addEventListener("click", () => showPopup(square, savedJournal));
    grid.appendChild(square);
  }

  function showPopup(square, savedJournal) {
    currentSquare = square;
    popup.classList.remove("hidden");
    overlay.classList.remove("hidden");

    const colorClass = square.className.split(" ")[1] || "none";
    const popupContent = `
              <p>How was your day?</p>
              <button class="color-option ${
                colorClass === "green" ? "selected" : ""
              }" data-color="green">
                Good <span class="color-circle green"></span>
              </button>
              <button class="color-option ${
                colorClass === "yellow" ? "selected" : ""
              }" data-color="yellow">
                Okayish <span class="color-circle yellow"></span>
              </button>
              <button class="color-option ${
                colorClass === "red" ? "selected" : ""
              }" data-color="red">
                Bad <span class="color-circle red"></span>
              </button>
              <button class="color-option reset ${
                colorClass === "reset" ? "selected" : ""
              }" data-color="reset">
                Reset <span class="color-circle reset"></span>
              </button>
              <div class="journal-container">
                <h2>Journal Entry for <span id="journal-date">${
                  square.innerHTML
                }</span></h2>
                <textarea id="journal-text" rows="10" placeholder="Write about your day...">${
                  savedJournal || ""
                }</textarea>
                <button id="save-journal">Save</button>
                <button id="cancel-journal">Cancel</button>
              </div>
            `;
    popup.innerHTML = popupContent;

    document.querySelectorAll(".color-option").forEach((button) => {
      button.addEventListener("click", (event) => {
        const color = button.dataset.color;
        if (color === "reset") {
          currentSquare.className = "square";
          localStorage.removeItem(`square-${currentSquare.dataset.index}`);
          localStorage.removeItem(`journal-${currentSquare.dataset.index}`);
          document.getElementById("journal-text").value = "";
        } else {
          currentSquare.className = `square ${color}`;
          localStorage.setItem(`square-${currentSquare.dataset.index}`, color);
        }
      });
    });

    document.getElementById("save-journal").addEventListener("click", () => {
      const journalText = document.getElementById("journal-text").value;
      localStorage.setItem(
        `journal-${currentSquare.dataset.index}`,
        journalText
      );
      const colorClass = currentSquare.className.split(" ")[1] || "";
      localStorage.setItem(`square-${currentSquare.dataset.index}`, colorClass);
      hidePopup();
      location.reload();
    });

    document
      .getElementById("cancel-journal")
      .addEventListener("click", hidePopup);
  }

  function hidePopup() {
    popup.classList.add("hidden");
    overlay.classList.add("hidden");
    currentSquare = null;
  }

  overlay.addEventListener("click", hidePopup);

  function updateDateTime() {
    const now = new Date();
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    };
    document.getElementById("currentDate").textContent = now.toLocaleDateString(
      undefined,
      options
    );
    document.getElementById("currentTime").textContent =
      now.toLocaleTimeString();

    const timeDiff = endDate - now;

    if (timeDiff > 0) {
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      document.getElementById(
        "countdown"
      ).textContent = `Countdown: ${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else {
      document.getElementById("countdown").textContent =
        "Countdown: 0d 0h 0m 0s";
    }
  }

  setInterval(updateDateTime, 1000);
  updateDateTime();
});
