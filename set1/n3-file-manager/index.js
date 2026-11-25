/*
 * Mary Grado
 * IV-BASIT C
 * N3 - File Manager
 * November 25, 2026
 */

const fs = require("node:fs");
const path = require("node:path");

const filesDirectory = path.join(__dirname, "files");

function getFilePath(fileName) {
    // Accept a file name only so commands stay inside the files folder.
    if (!fileName || fileName === "." || fileName === ".." || /[<>:"\/\\|?*\x00-\x1F]/.test(fileName)) {
        throw new Error("Enter a file name without a folder path.");
    }

    return path.join(filesDirectory, fileName);
}

function readText(filePath) {
    if (!fs.lstatSync(filePath).isFile()) {
        throw new Error("Choose a regular text file.");
    }

    return fs.readFileSync(filePath, "utf8");
}

function appendText(filePath, content) {
    if (!fs.lstatSync(filePath).isFile()) {
        throw new Error("Choose a regular text file.");
    }

    // Open in append mode without creating a missing file.
    const file = fs.openSync(filePath, fs.constants.O_WRONLY | fs.constants.O_APPEND);
    try {
        fs.appendFileSync(file, content + "\n", "utf8");
    } finally {
        fs.closeSync(file);
    }
}

function listFiles() {
    const fileNames = fs.readdirSync(filesDirectory, { withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name)
        .sort();

    if (fileNames.length === 0) {
        console.log("The files folder is empty.");
        return;
    }

    for (const fileName of fileNames) {
        const filePath = path.join(filesDirectory, fileName);
        console.log("Full path: " + filePath);
        console.log("File name: " + path.basename(filePath));
        console.log("Extension: " + (path.extname(filePath) || "(none)"));
        console.log("Contents:\n" + readText(filePath));
    }
}

function main(command, fileName, contentParts) {
    fs.mkdirSync(filesDirectory, { recursive: true });

    if (command === "list") {
        listFiles();
        return;
    }

    if (!["create", "read", "update", "delete"].includes(command)) {
        throw new Error("Choose create, read, update, delete, or list.");
    }

    const filePath = getFilePath(fileName);
    if ((command === "create" || command === "update") && contentParts.length === 0) {
        throw new Error("Enter the text after the file name.");
    }

    const content = contentParts.join(" ");
    switch (command) {
        case "create":
            fs.writeFileSync(filePath, content + "\n", { encoding: "utf8", flag: "wx" });
            console.log("Created: " + fileName);
            break;
        case "read":
            console.log("Contents of " + fileName + ":\n" + readText(filePath));
            break;
        case "update":
            appendText(filePath, content);
            console.log("Updated: " + fileName);
            break;
        case "delete":
            fs.unlinkSync(filePath);
            console.log("Deleted: " + fileName);
            break;
    }
}

const [command, fileName, ...contentParts] = process.argv.slice(2);
console.log("File Manager | Mary Grado | IV-BASIT C");

try {
    main(command, fileName, contentParts);
} catch (error) {
    if (error.code === "ENOENT") {
        console.error("Error: File not found: " + (fileName || "files folder"));
    } else if (error.code === "EEXIST") {
        console.error("Error: File already exists: " + fileName);
    } else {
        console.error("Error: " + error.message);
    }
    process.exitCode = 1;
}
