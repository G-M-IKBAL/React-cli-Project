// Importing required modules
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import { parse } from 'csv-parse/sync';

// Configure storage for multer, which handles file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Define the directory where files will be stored
      const dir = './draw-chart';
      // Create the directory if it doesn't exist
      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
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
const upload = multer({ storage: storage });

// Create an Express application
const app = express();
// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Endpoint for file upload
app.post('/upload', upload.single('file'), (req, res) => {
    try {
      // Send a success message if file upload is successful
      res.send('File uploaded successfully.');
    } catch (error) {
      // Handle any errors during file upload
      res.status(500).send(error);
    }
});

// Middleware for parsing JSON bodies
app.use(express.json());

// Endpoint to process and return filtered CSV data
app.post('/draw-chart', (req: Request, res: Response) => {
  const { fileName, columns }: { fileName: string; columns: string[] } = req.body;

  try {
    // Read the content of the specified file
    const fileContent: string = fs.readFileSync(`./draw-chart/${fileName}`, { encoding: 'utf-8' });
    // Parse the CSV file
    const records: any[] = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      bom: true 
    });
    
    // Filter data based on the specified columns
    const filteredData: any[] = records.map(row => {
      let filteredRow: { [key: string]: any } = {};
      columns.forEach(col => {
        filteredRow[col] = row[col];
      });
      return filteredRow;
    });

    // Return the filtered data as JSON
    res.json(filteredData);
  }
  catch (error:any) {
    // Handle errors during file processing
    console.error(error);
    res.status(500).send(`Error processing file: ${error.message}`);
  }
});

// Endpoint to delete a file
app.delete('/delete-file', async (req, res) => {
  try {
    const { fileName } = req.body;
    const filePath = path.join(__dirname, '../draw-chart', fileName);
    
    // Delete the specified file
    await fs.promises.unlink(filePath);
    res.send('File deleted successfully');
  } catch (err:any) {
    // Handle errors during file deletion
    res.status(500).send('Error deleting the file: ' + err.message);
  }
});

// Define the port for the server
const PORT = 3000;
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
