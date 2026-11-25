/*
 * Mary Grado
 * IV-BASIT C
 * N2 - Modular Calculator
 * November 25, 2026
 */

const path = require("node:path");
const operations = require("./operations");
const { formatResult } = require("./formatter");

function calculate(operation, argumentsFromTerminal) {
    if (!Object.hasOwn(operations, operation)) {
        const scriptName = path.basename(process.argv[1]);
        throw new Error(
            "Unknown operation. Choose add, subtract, multiply, divide, or average.\n" +
            "Example: node " + scriptName + " add 12 8"
        );
    }

    // Average can use a list of grades. The other operations use two numbers.
    if (operation === "average") {
        if (argumentsFromTerminal.length === 0) {
            throw new Error("Average requires at least one number.");
        }
    } else if (argumentsFromTerminal.length !== 2) {
        throw new Error("Enter exactly two numbers for " + operation + ".");
    }

    const numbers = argumentsFromTerminal.map((value) => {
        if (value.trim() === "") {
            return NaN;
        }
        return Number(value);
    });

    if (!numbers.every(Number.isFinite)) {
        throw new Error("Enter valid numbers.");
    }

    const result = operations[operation](...numbers);
    return formatResult(operation, numbers, result);
}

const [operation, ...argumentsFromTerminal] = process.argv.slice(2);
console.log("Modular Calculator | Mary Grado | IV-BASIT C");

try {
    console.log(calculate(operation, argumentsFromTerminal));
} catch (error) {
    console.error("Error: " + error.message);
    process.exitCode = 1;
}
