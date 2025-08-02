const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const db = new Database('./rollers.db');
app.use(cors()); // Allow frontend access
app.use(express.json());

app.post('/query', (req, res) => {
    const numbers = req.body.numbers;
    const ins = req.body.ins;

    const stmt = db.prepare(`
    SELECT * FROM results
    WHERE num_1 = ? AND num_2 = ? AND num_3 = ? AND num_4 = ? AND
          num_5 = ? AND num_6 = ? AND num_7 = ? AND num_8 = ? AND
          num_9 = ? AND ins = ?
  `);
    const result = stmt.get(...numbers, ins);
    res.json(result || {});
});

app.use(express.static(path.join(__dirname, '../solver/build')));



app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../solver/build/index.html'))
});

app.listen(PORT, () => console.log('API running on port 3001'));
