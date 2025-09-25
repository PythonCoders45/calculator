// calculator.js

// ---------------------------
// STATE
// ---------------------------
let currentInput = '';
let memory = 0;
let degreeMode = true; // true = degrees, false = radians
let history = [];

// ---------------------------
// DISPLAY FUNCTIONS
// ---------------------------
function updateDisplay() {
    const display = document.getElementById('display');
    display.value = currentInput || '0';
}

function addToHistory(entry) {
    history.push(entry);
    const historyEl = document.getElementById('history');
    historyEl.innerHTML = history.slice(-10).map(h => `<div>${h}</div>`).join('');
}

// ---------------------------
// INPUT HANDLERS
// ---------------------------
function append(value) {
    currentInput += value;
    updateDisplay();
}

function clearInput() {
    currentInput = '';
    updateDisplay();
}

function backspace() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
}

// ---------------------------
// MEMORY FUNCTIONS
// ---------------------------
function memoryClear() {
    memory = 0;
}

function memoryRecall() {
    currentInput += memory.toString();
    updateDisplay();
}

function memoryAdd() {
    memory += parseFloat(currentInput) || 0;
}

function memorySubtract() {
    memory -= parseFloat(currentInput) || 0;
}

// ---------------------------
// DEG/RAD TOGGLE
// ---------------------------
function toggleDegree() {
    degreeMode = !degreeMode;
    document.getElementById('degRad').innerText = degreeMode ? 'DEG' : 'RAD';
}

// ---------------------------
// MATH FUNCTIONS
// ---------------------------
function factorial(n) {
    n = Math.floor(n);
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
}

function calculate() {
    try {
        let expr = currentInput;

        // Replace constants
        expr = expr.replace(/π/g, Math.PI).replace(/e/g, Math.E);

        // Trig functions with degree/radian conversion
        expr = expr.replace(/sin\((.*?)\)/g, (_, x) => Math.sin(degreeMode ? (eval(x) * Math.PI / 180) : eval(x)));
        expr = expr.replace(/cos\((.*?)\)/g, (_, x) => Math.cos(degreeMode ? (eval(x) * Math.PI / 180) : eval(x)));
        expr = expr.replace(/tan\((.*?)\)/g, (_, x) => Math.tan(degreeMode ? (eval(x) * Math.PI / 180) : eval(x)));

        // Factorial
        expr = expr.replace(/(\d+)!/g, (_, x) => factorial(Number(x)));

        const result = eval(expr);
        addToHistory(`${currentInput} = ${result}`);
        currentInput = result.toString();
        updateDisplay();
    } catch (e) {
        currentInput = 'Error';
        updateDisplay();
    }
}

// ---------------------------
// GRAPHING (simple canvas plot)
// ---------------------------
function plotFunction(funcStr) {
    const canvas = document.getElementById('graph');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.strokeStyle = 'blue';
    const width = canvas.width;
    const height = canvas.height;

    for (let i = 0; i < width; i++) {
        let x = (i - width/2) / 20; // scale
        let y;
        try {
            y = eval(funcStr.replace(/x/g, `(${x})`));
        } catch {
            y = 0;
        }
        let screenY = height/2 - y*20; // scale
        if (i === 0) ctx.moveTo(i, screenY);
        else ctx.lineTo(i, screenY);
    }
    ctx.stroke();
}

// ---------------------------
// EXPORTS (for buttons in HTML)
// ---------------------------
window.append = append;
window.clearInput = clearInput;
window.backspace = backspace;
window.memoryClear = memoryClear;
window.memoryRecall = memoryRecall;
window.memoryAdd = memoryAdd;
window.memorySubtract = memorySubtract;
window.toggleDegree = toggleDegree;
window.calculate = calculate;
window.plotFunction = plotFunction;
