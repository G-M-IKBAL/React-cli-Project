"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing required modules
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const sync_1 = require("csv-parse/sync");
// Configure storage for multer, which handles file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // Define the directory where files will be stored
        const dir = './draw-chart';
        // Create the directory if it doesn't exist
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
        // Set the destination to the defined directory
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Use the original file name for the uploaded files
        cb(null, file.originalname);
    }
});
// Initialize multer with the configured storage
const upload = (0, multer_1.default)({ storage: storage });
// Create an Express application
const app = (0, express_1.default)();
// Enable Cross-Origin Resource Sharing (CORS)
app.use((0, cors_1.default)());
// Endpoint for file upload
app.post('/upload', upload.single('file'), (req, res) => {
    try {
        // Send a success message if file upload is successful
        res.send('File uploaded successfully.');
    }
    catch (error) {
        // Handle any errors during file upload
        res.status(500).send(error);
    }
});
// Middleware for parsing JSON bodies
app.use(express_1.default.json());
// Endpoint to process and return filtered CSV data
app.post('/draw-chart', (req, res) => {
    const { fileName, columns } = req.body;
    try {
        // Read the content of the specified file
        const fileContent = fs_1.default.readFileSync(`./draw-chart/${fileName}`, { encoding: 'utf-8' });
        // Parse the CSV file
        const records = (0, sync_1.parse)(fileContent, {
            columns: true,
            skip_empty_lines: true,
            bom: true
        });
        // Filter data based on the specified columns
        const filteredData = records.map(row => {
            let filteredRow = {};
            columns.forEach(col => {
                filteredRow[col] = row[col];
            });
            return filteredRow;
        });
        // Return the filtered data as JSON
        res.json(filteredData);
    }
    catch (error) {
        // Handle errors during file processing
        console.error(error);
        res.status(500).send(`Error processing file: ${error.message}`);
    }
});
// Endpoint to delete a file
app.delete('/delete-file', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fileName } = req.body;
        const filePath = path_1.default.join(__dirname, '../draw-chart', fileName);
        // Delete the specified file
        yield fs_1.default.promises.unlink(filePath);
        res.send('File deleted successfully');
    }
    catch (err) {
        // Handle errors during file deletion
        res.status(500).send('Error deleting the file: ' + err.message);
    }
}));
// Define the port for the server
const PORT = 3000;
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
