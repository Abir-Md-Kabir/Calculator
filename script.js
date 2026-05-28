let display;
let currentValue = '0';
let previousValue = '';
let operation = null;
let shouldResetDisplay = false;

function updateDisplay() {
    display.textContent = currentValue;
}

function appendNumber(number) {
    if (shouldResetDisplay) {
        currentValue = number;
        shouldResetDisplay = false;
    } else {
        currentValue = currentValue === '0' ? number : currentValue + number;
    }
    updateDisplay();
}

function appendOperator(op) {
    if (operation !== null && !shouldResetDisplay) {
        calculate();
    }
    previousValue = currentValue;
    operation = op;
    shouldResetDisplay = true;
}

function appendDecimal() {
    if (shouldResetDisplay) {
        currentValue = '0.';
        shouldResetDisplay = false;
    } else if (!currentValue.includes('.')) {
        currentValue += '.';
    }
    updateDisplay();
}

function clearDisplay() {
    currentValue = '0';
    previousValue = '';
    operation = null;
    shouldResetDisplay = false;
    updateDisplay();
}

function deleteLast() {
    if (currentValue.length > 1) {
        currentValue = currentValue.slice(0, -1);
    } else {
        currentValue = '0';
    }
    updateDisplay();
}

function calculate() {
    if (operation === null || shouldResetDisplay) return;
    
    let result;
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch(operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                currentValue = 'Error';
                operation = null;
                shouldResetDisplay = true;
                updateDisplay();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    currentValue = String(result);
    operation = null;
    shouldResetDisplay = true;
    updateDisplay();
}

// Initialize after DOM loads
document.addEventListener('DOMContentLoaded', function() {
    display = document.getElementById('display');
    
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const value = this.textContent;
            
            // Reset if showing error
            if (currentValue === 'Error' && value !== 'C') {
                clearDisplay();
            }
            
            if (value >= '0' && value <= '9') {
                appendNumber(value);
            } else if (value === 'C') {
                clearDisplay();
            } else if (value === '⌫') {
                deleteLast();
            } else if (value === '.') {
                appendDecimal();
            } else if (value === '=') {
                calculate();
            } else if (value === '+' || value === '-' || value === '×' || value === '/') {
                const op = value === '×' ? '*' : value;
                appendOperator(op);
            }
        });
    });
});