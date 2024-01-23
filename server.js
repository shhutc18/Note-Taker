// Import required modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

// Set the port to the environment variable PORT or 3001 if it's not set
const port = process.env.PORT || 3001;

// Create an Express application
const app = express();

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies
app.use(express.json());

// Route for getting the notes page
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

// Route for getting and posting notes
app.route('/api/notes')
    .get((req, res) => {
        // Read the notes from the file and send them as a response
        res.json(JSON.parse(fs.readFileSync('./db/db.json', 'utf8')))
    })
    .post((req, res) => {
        // Read the notes from the file
        let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
        
        // Add a unique id to the new note
        req.body.id = uuid.v4();
        
        // Add the new note to the array of notes
        notes.push(req.body);
        
        // Write the updated notes back to the file
        fs.writeFileSync('./db/db.json', JSON.stringify(notes), 'utf8');
        
        // Send the updated notes as a response
        res.json(notes);
    });

// Route for getting the home page
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

// Start the server
app.listen(port, () => console.log(`Server listening on port ${port}! Visit http://localhost:${port} in your browser!`));