const express = require('express');
const pool = require("./db");
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
const port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); 

app.use(express.json()); // Make sure this line is before your route handlers


app.get('/getIndices', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Quarterly_Indices_2022_byPropertyType"');

        res.json(result.rows);
    } catch (error) {
        console.error('Error executing database query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/getIndicesbyRegionhouse', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "House_Quarterly_Indices_2022_byRegion"');
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing database query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/getIndicesbyRegionapart', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Apartment_Quarterly_Indices_2022_byRegion"');
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing database query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/getcountsbyRegion', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "CountsAndWeights_byRegion"');
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing database query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/gettimedummy', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "TDHM_Indices"');
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing database query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.use(express.static('public'));

// Parse JSON bodies
app.use(express.json());

app.post('/posttimedummy', async (req, res) => {
    console.log(req.body); // Log to debug the actual structure of the received data
    
    // Define the SQL command to create the table
    const createTableText = `
        CREATE TABLE IF NOT EXISTS public."TDHM_Indices" (
            "Quarter" text,
            "Houses" double precision,
            "Apartments" double precision,
            "Aggregated Index" double precision
        );
    `;

    // Define the SQL command to insert data into the table
    const insertDataText = `
        INSERT INTO public."TDHM_Indices" ("Quarter", "Houses", "Apartments", "Aggregated Index")
        VALUES ($1, $2, $3, $4);
    `;

    try {
        // Create the table if it doesn't exist
        await pool.query(createTableText);

        // Destructure and validate the data from the request body
        const { Quarter, Houses, Apartments, 'Aggregated Index': AggregatedIndex } = req.body;

        // Validate that all required fields are present and are arrays
        if (!Array.isArray(Quarter) || !Array.isArray(Houses) || 
            !Array.isArray(Apartments) || !Array.isArray(AggregatedIndex)) {
            return res.status(400).json({ error: 'Input data must be arrays.' });
        }

        // Validate that all arrays have the same length
        const arrayLength = Quarter.length;
        if (Houses.length !== arrayLength || Apartments.length !== arrayLength || 
            AggregatedIndex.length !== arrayLength) {
            return res.status(400).json({ error: 'All input arrays must have the same length.' });
        }

        // Start a transaction
        await pool.query('BEGIN');

        // Insert the data into the table
        for (let i = 0; i < arrayLength; i++) {
            await pool.query(insertDataText, [
                Quarter[i],
                Houses[i],
                Apartments[i],
                AggregatedIndex[i]
            ]);
        }

        // Commit the transaction
        await pool.query('COMMIT');

        // Send a success response
        res.json({ message: 'Data inserted successfully' });
    } catch (error) {
        // If an error occurs, rollback the transaction
        await pool.query('ROLLBACK');

        // Log the error for debugging
        console.error('Error executing database query:', error);

        // Send an error response
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.get('/', async (req, res) => {
    try {
       res.status(200).json({success: true, message:"welcome to the application"});
    } catch (error) {
        console.error('Error executing database query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});



