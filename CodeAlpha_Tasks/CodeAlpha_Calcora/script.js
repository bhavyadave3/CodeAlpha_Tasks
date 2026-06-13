const resultEl = document.getElementById("result");
const expressionEl = document.getElementById("expression");

const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistory");

const themeToggle = document.getElementById("themeToggle");

const scientificToggle =
  document.getElementById("scientificToggle");

const scientificPanel =
  document.getElementById("scientificPanel");

const buttons =
  document.querySelectorAll("[data-value]");

const actionButtons =
  document.querySelectorAll("[data-action]");

const sciButtons =
  document.querySelectorAll(".sci-btn");

/* =========================
   STATE
========================= */
let lastExpression = "";
let currentInput = "";
let history =
  JSON.parse(
    localStorage.getItem("calcora_history")
  ) || [];

/* =========================
   DISPLAY
========================= */

function updateDisplay() {

    expressionEl.textContent = lastExpression;

    resultEl.textContent = currentInput || "0";
}

/* =========================
   HISTORY
========================= */

function saveHistory() {
  localStorage.setItem(
    "calcora_history",
    JSON.stringify(history)
  );
}

function renderHistory() {

  historyList.innerHTML = "";

  if (history.length === 0) {

    historyList.innerHTML =
      `<div style="opacity:.6">
         No calculations yet
       </div>`;

    return;
  }

  history.forEach(item => {

    const div =
      document.createElement("div");

    div.classList.add("history-item");

    div.innerHTML = `
      <div>${item.expression}</div>
      <div class="history-result">
        = ${item.result}
      </div>
    `;

    div.addEventListener("click", () => {

      currentInput =
        item.result.toString();

      updateDisplay();
    });

    historyList.appendChild(div);
  });
}

renderHistory();

/* =========================
   FORMAT
========================= */

function formatExpression(exp) {

  exp = exp.replace(/÷/g, "/");
  exp = exp.replace(/×/g, "*");

  exp = exp.replace(
    /(\d+(\.\d+)?)%/g,
    "($1/100)"
  );

  return exp;
}

/* =========================
   CALCULATE
========================= */

function calculate(exp) {

  try {

    exp = formatExpression(exp);

    return Function(
      `"use strict";
       return (${exp})`
    )();

  } catch {

    return "Error";
  }
}

/* =========================
   NUMBER BUTTONS
========================= */

buttons.forEach(btn => {

  btn.addEventListener("click", () => {

    currentInput +=
      btn.dataset.value;

    updateDisplay();
  });

});

/* =========================
   ACTION BUTTONS
========================= */

actionButtons.forEach(btn => {

  btn.addEventListener("click", () => {

    const action =
      btn.dataset.action;

    /* CLEAR */

    if (action === "clear") {

      currentInput = "";
    lastExpression = "";

    updateDisplay();
    }

    /* DELETE */

    if (action === "delete") {

     currentInput = result.toString();

    expressionEl.textContent =
    expression + " =";

    resultEl.textContent =
    result;
    }

    /* EQUAL */

    if (action === "equals") {

      if (!currentInput) return;

      const expression =
        currentInput;

      const result =
        calculate(currentInput);

      history.unshift({
        expression,
        result
      });

      if (history.length > 20)
        history.pop();

      saveHistory();
      renderHistory();

      lastExpression = expression + " =";

    currentInput = result.toString();

    updateDisplay();
    }

  });

});

/* =========================
   SCIENTIFIC TOGGLE
========================= */

scientificToggle.addEventListener(
  "click",
  () => {

    scientificPanel.classList.toggle(
      "active"
    );

  }
);

/* =========================
   SCIENTIFIC FUNCTIONS
========================= */

sciButtons.forEach(btn => {

  btn.addEventListener("click", () => {

    const type =
      btn.dataset.sci;

    let value =
      parseFloat(currentInput);

    if (isNaN(value)) value = 0;

    switch(type) {

      case "sqrt":
        currentInput =
          Math.sqrt(value).toString();
        break;

      case "square":
        currentInput =
          Math.pow(value,2).toString();
        break;

      case "sin":
        currentInput =
          Math.sin(
            value * Math.PI / 180
          ).toString();
        break;

      case "cos":
        currentInput =
          Math.cos(
            value * Math.PI / 180
          ).toString();
        break;

      case "tan":
        currentInput =
          Math.tan(
            value * Math.PI / 180
          ).toString();
        break;

      case "log":
        currentInput =
          Math.log10(value).toString();
        break;

      case "pi":
        currentInput += Math.PI;
        break;

      case "e":
        currentInput += Math.E;
        break;
    }

    updateDisplay();

  });

});

/* =========================
   CLEAR HISTORY
========================= */

clearHistoryBtn.addEventListener(
  "click",
  () => {

    history = [];

    localStorage.removeItem(
      "calcora_history"
    );

    renderHistory();

  }
);

/* =========================
   THEME
========================= */

const savedTheme =
  localStorage.getItem(
    "calcora_theme"
  );


if (savedTheme === "light") {

  document.body.classList.add(
    "light"
  );

  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener(
  "click",
  () => {

    document.body.classList.toggle(
      "light"
    );

    const isLight =
      document.body.classList.contains(
        "light"
      );

    themeToggle.textContent =
      isLight ? "☀️" : "🌙";

    localStorage.setItem(
      "calcora_theme",
      isLight ? "light" : "dark"
    );

  }
);

/* =========================
   KEYBOARD SUPPORT
========================= */

document.addEventListener(
  "keydown",
  e => {

    const key = e.key;

    if (
      !isNaN(key) ||
      "+-*/.%()".includes(key)
    ) {

      currentInput += key;
      updateDisplay();
    }

    if (key === "Backspace") {

      currentInput =
        currentInput.slice(0, -1);

      updateDisplay();
    }

    if (key === "Enter") {

      const result =
        calculate(currentInput);

      history.unshift({
        expression: currentInput,
        result
      });

      saveHistory();
      renderHistory();

      currentInput =
        result.toString();

      updateDisplay();
    }

    if (
      key.toLowerCase() === "c"
    ) {

      currentInput = "";

      updateDisplay();
    }

  }
);

/* =========================
   INITIAL LOAD
========================= */

updateDisplay();