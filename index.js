const display = document.getElementById("display");
const operationButtons = document.querySelectorAll(".operation");
const numberButtons = document.querySelectorAll(".number");
const clearButton = document.getElementById("clear");
const equalsButton = document.getElementById("equals");

let previousNumber = null;
let operator = null;
let isNewInput = true;

function appendToDisplay(input) {
    let currentValue = display.value.replace(/,/g, "").replace(/ /g, "");

    // Handle decimal point
    if (input === ".") {
        if (currentValue === "" || isNewInput) {
            display.value = "0.";
            isNewInput = false;
        } else if (!display.value.includes(".")) {
            display.value += input;
        }
    } else {
        // Handle numbers
        if (isNewInput) {
            if (input === "0") {
                display.value = "0";
            } else {
                display.value = input;
            }
            isNewInput = false;
        } else {
            // Prevent multiple leading zeros
            if (currentValue === "0" && input === "0") {
                return;
            }
            // Prevent adding more zeros after a non-zero digit
            if (currentValue === "0" && input !== "0") {
                display.value = input;
            } else {
                display.value += input;
            }
        }
        // Format and validate the number
        let newValue = display.value.replace(/ /g, "");
        if (isValidNumber(newValue)) {
            display.value = formatNumber(newValue);
        }
    }
    removeActiveClass();
}

function setOperator(event) {
    const op = event.target.dataset.value;
    if (op === "=") {
        calculate();
        return;
    }

    if (previousNumber !== null && operator !== null && !isNewInput) {
        calculate();
    }
    previousNumber = parseFloat(
        display.value.replace(/,/g, "").replace(/ /g, "")
    );
    operator = op;
    isNewInput = true;
    removeActiveClass();
    addActiveClass(event.target);
}

function clearDisplay() {
    display.value = "0";
    previousNumber = null;
    operator = null;
    isNewInput = true;
    removeActiveClass();
}

function addActiveClass(element) {
    element.classList.add("active");
}

function removeActiveClass() {
    document
        .querySelectorAll(".operation.active")
        .forEach((el) => el.classList.remove("active"));
}

function calculate() {
    if (previousNumber === null || operator === null) return;

    let currentNumber = parseFloat(
        display.value.replace(/,/g, "").replace(/ /g, "")
    );
    let result;

    switch (operator) {
        case "+":
            result = previousNumber + currentNumber;
            break;
        case "-":
            result = previousNumber - currentNumber;
            break;
        case "*":
            result = previousNumber * currentNumber;
            break;
        case "/":
            if (currentNumber === 0) {
                result = "😆";
            } else {
                result = previousNumber / currentNumber;
            }
            break;
        default:
            result = "error";
            break;
    }

    if (typeof result === "number") {
        // Format to 1 decimal place without rounding up
        let formattedResult = formatNumber(result.toFixed(10).replace(/\.?0+$/, ""));
        display.value = formattedResult.length <= 10 ? formattedResult : formatNumber(result.toPrecision(10));
    } else {
        display.value = result;
    }

    previousNumber = null;
    operator = null;
    removeActiveClass();
    isNewInput = true;
}

function formatNumber(num) {
    if (isNaN(num)) return "error";

    let numStr = num.toString().replace(/,/g, "");
    let parts = numStr.split(".");
    let integerPart = parts[0];
    let decimalPart = parts[1] ? "." + parts[1] : "";

    if (integerPart.length > 10) {
        integerPart = integerPart.slice(0, 10);
        decimalPart = "";
    }

    let formatted = "";
    for (let i = integerPart.length - 1, count = 1; i >= 0; i--, count++) {
        formatted = integerPart[i] + formatted;
        if (count % 3 === 0 && i !== 0 && count !== 10) {
            formatted = " " + formatted;
        }
    }

    formatted += decimalPart;
    if (formatted.length > 10) {
        formatted = formatted.slice(0, 10);
    }

    return formatted;
}

function isValidNumber(value) {
    let num = value.replace(/,/g, "").replace(/ /g, "");
    if (num.length > 10) return false;
    return true;
}

function handlePlusMinus() {
    let currentNumber = parseFloat(
        display.value.replace(/,/g, "").replace(/ /g, "")
    );

    if (!isNaN(currentNumber)) {
        currentNumber = -currentNumber;
        display.value = formatNumber(currentNumber.toFixed(1).replace(/\.0$/, ""));
    }
}

function handlePercentage() {
    let currentNumber = parseFloat(
        display.value.replace(/,/g, "").replace(/ /g, "")
    );

    if (!isNaN(currentNumber)) {
        // Calculate the percentage
        currentNumber = currentNumber / 100;

        // Format the number
        display.value = formatNumber(currentNumber.toFixed(2).replace(/\.00$/, ""));

        // Optionally, you might want to handle numbers that are too long
        if (display.value.length > 10) {
            display.value = formatNumber(currentNumber.toPrecision(10));
        }
    }
}

operationButtons.forEach((button) => {
    button.addEventListener("click", setOperator);
});

numberButtons.forEach((button) => {
    button.addEventListener("click", () => appendToDisplay(button.dataset.value));
});

clearButton.addEventListener("click", clearDisplay);
equalsButton.addEventListener("click", () => calculate());
document.getElementById("plus-minus").addEventListener("click", handlePlusMinus);
document.getElementById("percent").addEventListener("click", handlePercentage);
