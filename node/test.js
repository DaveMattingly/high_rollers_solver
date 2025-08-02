const Database = require('better-sqlite3');
const db = new Database('rollers.db');

//const row = db.prepare("SELECT * FROM results WHERE num_1 = ? and num_2 = ? and num_3 = ? and num_4 = ? and num_5 = ? and num_6 = ? and num_7 = ? and num_8 = ? and num_9 = ? and ins = ?").run(1, 1, 1, 1, 1, 1, 1, 1, 1, 0);
const rows = db.prepare("SELECT * FROM results WHERE num_1 = 0 AND num_2 = 0 AND num_3 = 0 AND num_4 = 0 AND num_5 = 0 AND num_6 = 1 AND num_7 = 0 AND num_8 = 0 AND num_9 = 0 AND ins = 1 LIMIT 1")
for(const row of rows.all()) {
    console.log(row);
}