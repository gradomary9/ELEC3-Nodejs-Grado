/*
 * Mary Grado
 * IV-BASIT C
 * N2 - Modular Calculator
 * November 25, 2026
 */

const symbols = {
    add: "+",
    subtract: "-",
    multiply: "*",
    divide: "/",
};

function formatResult(operation, numbers, result) {
    if (operation === "average") {
        return "Average of " + numbers.join(", ") + " = " + result;
    }

    return numbers.join(" " + symbols[operation] + " ") + " = " + result;
}

module.exports = { formatResult };
