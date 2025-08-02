function getChance(db, num_1, num_2, num_3, num_4, num_5, num_6, num_7, num_8, num_9, ins) {
    const fix_ins = Math.min(3, ins);
    const row = db.prepare("SELECT chance FROM results WHERE num_1 = ? and num_2 = ? and num_3 = ? and num_4 = ? and num_5 = ? and num_6 = ? and num_7 = ? and num_8 = ? and num_9 = ? and ins = ?").get(num_1, num_2, num_3, num_4, num_5, num_6, num_7, num_8, num_9, fix_ins);
    return row.chance;
}

const Database = require('better-sqlite3');
const db = new Database('rollers.db');

db.prepare(`
  CREATE TABLE IF NOT EXISTS results (
    num_1 INTEGER,
    num_2 INTEGER,
    num_3 INTEGER,
    num_4 INTEGER,
    num_5 INTEGER,
    num_6 INTEGER,
    num_7 INTEGER,
    num_8 INTEGER,
    num_9 INTEGER,
    ins INTEGER,
    chance REAL,
    action_2 TEXT,
    action_3 TEXT,
    action_4 TEXT,
    action_5 TEXT,
    action_6 TEXT,
    action_7 TEXT,
    action_8 TEXT,
    action_9 TEXT,
    action_10 TEXT,
    action_11 TEXT,
    action_12 TEXT
  )
`).run();

db.prepare("DELETE FROM results;").run();
db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS results_u1 ON results(num_1, num_2, num_3, num_4, num_5, num_6, num_7, num_8, num_9, ins)");

for(ins = 0; ins <= 3; ++ins) {
    for(a = 0; a  <= 1; ++a) {
        for(b = 0; b <= 1; ++b) {
            for(c = 0; c <= 1; ++c) {
                for(d = 0; d <= 1; ++d) {
                    for(e = 0; e <= 1; ++e) {
                        for(f = 0; f <= 1; ++f) {
                            for(g = 0; g <= 1; ++g) {
                                for(h = 0; h <= 1; ++h) {
                                    for(i = 0; i <= 1; ++i) {
                                        db.prepare("INSERT INTO results (num_1, num_2, num_3, num_4, num_5, num_6, num_7, num_8, num_9, ins) VALUES (?,?,?,?,?,?,?,?,?,?)").run(a, b, c, d, e, f, g, h, i, ins);
                                    }

                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

db.prepare("UPDATE results SET CHANCE = 1 WHERE num_1 = 0 AND num_2 = 0 and num_3 = 0 and num_4 = 0 and num_5 = 0 and num_6 = 0 and num_7 = 0 and num_8 = 0 and num_9 = 0").run();

const rows = db.prepare("SELECT num_1, num_2, num_3, num_4, num_5, num_6, num_7, num_8, num_9, ins FROM results WHERE (num_1 + num_2 + num_3 + num_4 + num_5 + num_6 + num_7 + num_8 + num_9) > 0 ORDER BY (num_1 + num_2 + num_3 + num_4 + num_5 + num_6 + num_7 + num_8 + num_9) ASC, ins ASC");

for(const row of rows.all()) {
    console.log(row);
    let sumChance = 0;
    let denominator = 0;
    let action_2 = "N/A";
    let action_3 = "N/A";
    let action_4 = "N/A";
    let action_5 = "N/A";
    let action_6 = "N/A";
    let action_7 = "N/A";
    let action_8 = "N/A";
    let action_9 = "N/A";
    let action_10 = "N/A";
    let action_11 = "N/A";
    let action_12 = "N/A";
    let best_chance = 0;
    let best_action = "N/A";
    let result;

    //Roll a 2, always insurance, can only remove 2.
    if (row.num_2 === 1) {
        result = getChance(db, row.num_1, 0, row.num_3, row.num_4, row.num_5, row.num_6, row.num_7, row.num_8, row.num_9, row.ins+1);
        sumChance += result;
        action_2 = "2";
        denominator += 1;
    }

    //Roll a 3, can remove 3 or 1+2
    best_chance = 0;
    best_action = "N/A"
    if (row.num_3 === 1) {
        result = getChance(db, row.num_1, row.num_2, 0, row.num_4, row.num_5, row.num_6, row.num_7, row.num_8, row.num_9, row.ins);
        best_chance = result;
        best_action = "3";
    }
    if (row.num_1 === 1 && row.num_2 === 1) {
        result = getChance(db, 0, 0, row.num_3, row.num_4, row.num_5, row.num_6, row.num_7, row.num_8, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "12";
        }
    }
    denominator += 2;
    if(best_action === "N/A" && row.ins > 0) {
        best_chance = getChance(db, row.num_1, row.num_2, row.num_3, row.num_4, row.num_5, row.num_6, row.num_7, row.num_8, row.num_9, row.ins-1);
    }
    sumChance += best_chance * 2;
    action_3 = best_action;

    //Roll a 4, 1/3 insurance, can remove 4 or 1+3
    best_chance = 0;
    best_action = "N/A";
    if(row.num_4 === 1) {
        result = getChance(db, row.num_1, row.num_2, row.num_3, 0, row.num_5, row.num_6, row.num_7, row.num_8, row.num_9, row.ins+1);
        result += getChance(db, row.num_1, row.num_2, row.num_3, 0, row.num_5, row.num_6, row.num_7, row.num_8, row.num_9, row.ins)*2;
        result /= 3;
        best_chance = result;
        best_action = "4";
    }
    if (row.num_1 === 1 && row.num_3 === 1) {
        result = getChance(db, 0, row.num_2, 0, row.num_4, row.num_5, row.num_6, row.num_7, row.num_8, row.num_9, row.ins+1);
        result += getChance(db, 0, row.num_2, 0, row.num_4, row.num_5, row.num_6, row.num_7, row.num_8, row.num_9, row.ins)*2;
        result /= 3;
        if(best_chance < result) {
            best_chance = result
            best_action = "13";
        }
    }
    if(best_action === "N/A" && row.ins > 0) {
        best_chance = getChance(db, row.num_1, row.num_2, row.num_3, row.num_4, row.num_5, row.num_6, row.num_7, row.num_8, row.num_9, row.ins-1);
    }
    sumChance += best_chance * 3;
    if(best_action === "N/A") {
        denominator += 2;
    } else {
        denominator += 3;
    }
    action_4 = best_action;

    //Roll a 5, can remove 5, 1+4, 2+3
    best_chance = 0;
    best_action = "N/A"
    if (row.num_5 === 1) {
        result = getChance(db, row.num_1, row.num_2, row.num_3, row.num_4, 0, row.num_6, row.num_7, row.num_8, row.num_9, row.ins);
        best_chance = result;
        best_action = "5";
    }
    if (row.num_1 === 1 && row.num_4 === 1) {
        result = getChance(db, 0, row.num_2, row.num_3, 0, row.num_5, row.num_6, row.num_7, row.num_8, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "14";
        }
    }
    if (row.num_2 === 1 && row.num_3 === 1) {
        result = getChance(db, row.num_1, 0, 0, row.num_4, row.num_5, row.num_6, row.num_7, row.num_8, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "23";
        }
    }
    if(best_action === "N/A" && row.ins > 0) {
        best_chance = getChance(db, row.num_1, row.num_2, row.num_3, row.num_4, row.num_5, row.num_6, row.num_7, row.num_8, row.num_9, row.ins-1);
    }
    sumChance += best_chance * 4;
    denominator += 4;
    action_5 = best_action;

    //Roll a 6, 1/5 insurance, can remove 6, 1+5, 2=4, 1+2+3
    best_chance = 0;
    best_action = "N/A";
    if(row.num_6 === 1) {
        result = getChance(db, row.num_1, row.num_2, row.num_3, row.num_4, row.num_5, 0, row.num_7, row.num_8, row.num_9, row.ins+1);
        result += getChance(db, row.num_1, row.num_2, row.num_3, row.num_4, row.num_5, 0, row.num_7, row.num_8, row.num_9, row.ins)*4;
        result /= 5;
        best_chance = result;
        best_action = "6";
    }
    if (row.num_1 === 1 && row.num_5 === 1) {
        result = getChance(db, 0, row.num_2, row.num_3, row.num_4, 0, row.num_6, row.num_7, row.num_8, row.num_9, row.ins+1);
        result += getChance(db, 0, row.num_2, row.num_3, row.num_4, 0, row.num_6, row.num_7, row.num_8, row.num_9, row.ins)*4;
        result /= 5;
        if(best_chance < result) {
            best_chance = result
            best_action = "15";
        }
    }
    if (row.num_2 === 1 && row.num_4 === 1) {
        result = getChance(db, row.num_1, 0, row.num_3, 0, row.num_5, row.num_6, row.num_7, row.num_8, row.num_9, row.ins+1);
        result += getChance(db, row.num_1, 0, row.num_3, 0, row.num_5, row.num_6, row.num_7, row.num_8, row.num_9, row.ins)*4;
        result /= 5;
        if(best_chance < result) {
            best_chance = result
            best_action = "24";
        }
    }
    if (row.num_1 === 1 && row.num_2 === 1 && row.num_3 == 1) {
        result = getChance(db, 0, 0, 0, row.num_4, row.num_5, row.num_6, row.num_7, row.num_8, row.num_9, row.ins+1);
        result += getChance(db, 0, 0, 0, row.num_4, row.num_5, row.num_6, row.num_7, row.num_8, row.num_9, row.ins)*4;
        result /= 5;
        if(best_chance < result) {
            best_chance = result
            best_action = "123";
        }
    }
    if(best_action === "N/A" && row.ins > 0) {
        best_chance = getChance(db, row.num_1, row.num_2, row.num_3, row.num_4, row.num_5, row.num_6, row.num_7, row.num_8, row.num_9, row.ins-1);
    }
    sumChance += best_chance * 5;
    if(best_action === "N/A") {
        denominator += 4;
    } else {
        denominator += 5;
    }
    action_6 = best_action;

    //Roll a 7, can remove 7, 1+6, 2+5, 3+4, 1+2+4.
    best_chance = 0;
    best_action = "N/A"
    if (row.num_7 === 1) {
        result = getChance(db, row.num_1, row.num_2, row.num_3, row.num_4, row.num_5, row.num_6, 0, row.num_8, row.num_9, row.ins);
        best_chance = result;
        best_action = "7";
    }
    if (row.num_1 === 1 && row.num_6 === 1) {
        result = getChance(db, 0, row.num_2, row.num_3, row.num_4, row.num_5, 0, row.num_7, row.num_8, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "16";
        }
    }
    if (row.num_2 === 1 && row.num_5 === 1) {
        result = getChance(db, row.num_1, 0, row.num_3, row.num_4, 0, row.num_6, row.num_7, row.num_8, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "25";
        }
    }
    if (row.num_3 === 1 && row.num_4 === 1) {
        result = getChance(db, row.num_1, row.num_2, 0, 0, row.num_5, row.num_6, row.num_7, row.num_8, row.num_9, row.ins);
        if (best_chance < result) {
            best_chance = result
            best_action = "34";
        }
    }
    if (row.num_1 === 1 && row.num_2 === 1 && row.num_4 === 1) {
        result = getChance(db, 0, 0, row.num_3, 0, row.num_5, row.num_6, row.num_7, row.num_8, row.num_9, row.ins);
        if (best_chance < result) {
            best_chance = result
            best_action = "124";
        }
    }
    if(best_action === "N/A" && row.ins > 0) {
        best_chance = getChance(db, row.num_1, row.num_2, row.num_3, row.num_4, row.num_5, row.num_6, row.num_7, row.num_8, row.num_9, row.ins-1);
    }
    sumChance += best_chance * 6;
    denominator += 6;
    action_7 = best_action;

    //Roll a 8, 1/5 insurance, can remove 8, 1+7, 2+6, 3+5, 1+2+5, 1+3+4
    best_chance = 0;
    best_action = "N/A";
    if(row.num_8 === 1) {
        result = getChance(db, row.num_1, row.num_2, row.num_3, row.num_4, row.num_5, row.num_6, row.num_7, 0, row.num_9, row.ins+1);
        result += getChance(db, row.num_1, row.num_2, row.num_3, row.num_4, row.num_5, row.num_6, row.num_7, 0, row.num_9, row.ins)*4;
        result /= 5;
        best_chance = result;
        best_action = "8";
    }
    if (row.num_1 === 1 && row.num_7 === 1) {
        result = getChance(db, 0, row.num_2, row.num_3, row.num_4, row.num_5, row.num_6, 0, row.num_8, row.num_9, row.ins+1);
        result += getChance(db, 0, row.num_2, row.num_3, row.num_4, row.num_5, row.num_6, 0, row.num_8, row.num_9, row.ins)*4;
        result /= 5;
        if(best_chance < result) {
            best_chance = result
            best_action = "17";
        }
    }
    if (row.num_2 === 1 && row.num_6 === 1) {
        result = getChance(db, row.num_1, 0, row.num_3, row.num_4, row.num_5, 0, row.num_7, row.num_8, row.num_9, row.ins+1);
        result += getChance(db, row.num_1, 0, row.num_3, row.num_4, row.num_5, 0, row.num_7, row.num_8, row.num_9, row.ins)*4;
        result /= 5;
        if(best_chance < result) {
            best_chance = result
            best_action = "26";
        }
    }
    if (row.num_3 === 1 && row.num_5 === 1) {
        result = getChance(db, row.num_1, row.num_2, 0, row.num_4, 0, row.num_6, row.num_7, row.num_8, row.num_9, row.ins+1);
        result += getChance(db, row.num_1, row.num_2, 0, row.num_4, 0, row.num_6, row.num_7, row.num_8, row.num_9, row.ins)*4;
        result /= 5;
        if(best_chance < result) {
            best_chance = result
            best_action = "35";
        }
    }
    if (row.num_1 === 1 && row.num_2 === 1 && row.num_5 == 1) {
        result = getChance(db, 0, 0, row.num_3, row.num_4, 0, row.num_6, row.num_7, row.num_8, row.num_9, row.ins+1);
        result += getChance(db, 0, 0, row.num_3, row.num_4, 0, row.num_6, row.num_7, row.num_8, row.num_9, row.ins)*4;
        result /= 5;
        if(best_chance < result) {
            best_chance = result
            best_action = "125";
        }
    }
    if (row.num_1 === 1 && row.num_3 === 1 && row.num_4 == 1) {
        result = getChance(db, 0, row.num_2, 0, 0, row.num_5, row.num_6, row.num_7, row.num_8, row.num_9, row.ins+1);
        result += getChance(db, 0, row.num_2, 0, 0, row.num_5, row.num_6, row.num_7, row.num_8, row.num_9, row.ins)*4;
        result /= 5;
        if(best_chance < result) {
            best_chance = result
            best_action = "134";
        }
    }
    if(best_action === "N/A" && row.ins > 0) {
        best_chance = getChance(db, row.num_1, row.num_2, row.num_3, row.num_4, row.num_5, row.num_6, row.num_7, row.num_8, row.num_9, row.ins-1);
    }
    sumChance += best_chance * 5;
    if(best_action === "N/A") {
        denominator += 4;
    } else {
        denominator += 5;
    }
    action_8 = best_action;

    //Roll a 9, can remove 9, 1+8, 2+7, 3+6, 4+5, 1+2+6, 1+3+5, 2+3+4
    best_chance = 0;
    best_action = "N/A"
    if (row.num_9 === 1) {
        result = getChance(db, row.num_1, row.num_2, row.num_3, row.num_4, row.num_5, row.num_6, row.num_7, row.num_8, 0, row.ins);
        best_chance = result;
        best_action = "9";
    }
    if (row.num_1 === 1 && row.num_4 === 8) {
        result = getChance(db, 0, row.num_2, row.num_3, row.num_4, row.num_5, row.num_6, row.num_7, 0, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "18";
        }
    }
    if (row.num_2 === 1 && row.num_7 === 1) {
        result = getChance(db, row.num_1, 0, row.num_3, row.num_4, row.num_5, row.num_6, 0, row.num_8, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "27";
        }
    }
    if (row.num_3 === 1 && row.num_6 === 1) {
        result = getChance(db, row.num_1, row.num_2, 0, row.num_4, row.num_5, 0, row.num_7, row.num_8, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "36";
        }
    }
    if (row.num_4 === 1 && row.num_5 === 1) {
        result = getChance(db, row.num_1, row.num_2, row.num_3, 0, 0, row.num_6, row.num_7, row.num_8, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "45";
        }
    }
    if (row.num_1 === 1 && row.num_2 === 1 && row.num_6 === 1) {
        result = getChance(db, 0, 0, row.num_3, row.num_4, row.num_5, 0, row.num_7, row.num_8, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "126";
        }
    }
    if (row.num_1 === 1 && row.num_3 === 1 && row.num_5 === 1) {
        result = getChance(db, 0, row.num_2, 0, row.num_4, 0, row.num_6, row.num_7, row.num_8, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "135";
        }
    }
    if (row.num_2 === 1 && row.num_3 === 1 && row.num_4 === 1) {
        result = getChance(db, row.num_1, 0, 0, 0, row.num_5, row.num_6, row.num_7, row.num_8, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "234";
        }
    }
    if(best_action === "N/A" && row.ins > 0) {
        best_chance = getChance(db, row.num_1, row.num_2, row.num_3, row.num_4, row.num_5, row.num_6, row.num_7, row.num_8, row.num_9, row.ins-1);
    }
    sumChance += best_chance * 4;
    denominator += 4;
    action_9 = best_action;

    //Roll a 10, 1/3 insurance, can remove 1+9, 2+8, 3+7, 4+6, 1+2+7, 1+3+6, 1+4+5, 2+3+5, 1+2+3+4
    best_chance = 0;
    best_action = "N/A";
    if(row.num_1 === 1 && row.num_9 === 1) {
        result = getChance(db, 0, row.num_2, row.num_3, row.num_4, row.num_5, row.num_6, row.num_7, row.num_8, 0, row.ins+1);
        result += getChance(db, 0, row.num_2, row.num_3, row.num_4, row.num_5, row.num_6, row.num_7, row.num_8, 0, row.ins)*2;
        result /= 3;
        best_chance = result;
        best_action = "19";
    }
    if (row.num_2 === 1 && row.num_8 === 1) {
        result = getChance(db, row.num_1, 0, row.num_3, row.num_4, row.num_5, row.num_6, row.num_7, 0, row.num_9, row.ins+1);
        result += getChance(db, row.num_1, 0, row.num_3, row.num_4, row.num_5, row.num_6, row.num_7, 0, row.num_9, row.ins)*2;
        result /= 3;
        if(best_chance < result) {
            best_chance = result
            best_action = "28";
        }
    }
    if (row.num_3 === 1 && row.num_7 === 1) {
        result = getChance(db, row.num_1, row.num_2, 0, row.num_4, row.num_5, row.num_6, 0, row.num_8, row.num_9, row.ins+1);
        result += getChance(db, row.num_1, row.num_2, 0, row.num_4, row.num_5, row.num_6, 0, row.num_8, row.num_9, row.ins)*2;
        result /= 3;
        if(best_chance < result) {
            best_chance = result
            best_action = "37";
        }
    }
    if (row.num_4 === 1 && row.num_6 === 1) {
        result = getChance(db, row.num_1, row.num_2, row.num_3, 0, row.num_5, 0, row.num_7, row.num_8, row.num_9, row.ins+1);
        result += getChance(db, row.num_1, row.num_2, row.num_3, 0, row.num_5, 0, row.num_7, row.num_8, row.num_9, row.ins)*2;
        result /= 3;
        if(best_chance < result) {
            best_chance = result
            best_action = "46";
        }
    }
    if (row.num_1 === 1 && row.num_2 === 1 && row.num_7 === 1) {
        result = getChance(db, 0, 0, row.num_3, row.num_4, row.num_5, row.num_6, 0, row.num_8, row.num_9, row.ins+1);
        result += getChance(db, 0, 0, row.num_3, row.num_4, row.num_5, row.num_6, 0, row.num_8, row.num_9, row.ins)*2;
        result /= 3;
        if(best_chance < result) {
            best_chance = result
            best_action = "127";
        }
    }
    if (row.num_1 === 1 && row.num_3 === 1 && row.num_6 === 1) {
        result = getChance(db, 0, row.num_2, 0, row.num_4, row.num_5, 0, row.num_7, row.num_8, row.num_9, row.ins+1);
        result += getChance(db, 0, row.num_2, 0, row.num_4, row.num_5, 0, row.num_7, row.num_8, row.num_9, row.ins)*2;
        result /= 3;
        if(best_chance < result) {
            best_chance = result
            best_action = "136";
        }
    }
    if (row.num_1 === 1 && row.num_4 === 1 && row.num_5 === 1) {
        result = getChance(db, 0, row.num_2, row.num_3, 0, 0, row.num_6, row.num_7, row.num_8, row.num_9, row.ins+1);
        result += getChance(db, 0, row.num_2, row.num_3, 0, 0, row.num_6, row.num_7, row.num_8, row.num_9, row.ins)*2;
        result /= 3;
        if(best_chance < result) {
            best_chance = result
            best_action = "145";
        }
    }
    if (row.num_2 === 1 && row.num_3 === 1 && row.num_5 === 1) {
        result = getChance(db, row.num_1, 0, 0, row.num_4, 0, row.num_6, row.num_7, row.num_8, row.num_9, row.ins+1);
        result += getChance(db, row.num_1, 0, 0, row.num_4, 0, row.num_6, row.num_7, row.num_8, row.num_9, row.ins)*2;
        result /= 3;
        if(best_chance < result) {
            best_chance = result
            best_action = "235";
        }
    }
    if (row.num_1 === 1 && row.num_2 === 1 && row.num_3 === 1 && row.num_4 === 1) {
        result = getChance(db, 0, 0, 0, 0, row.num_5, row.num_6, row.num_7, row.num_8, row.num_9, row.ins+1);
        result += getChance(db, 0, 0, 0, 0, row.num_5, row.num_6, row.num_7, row.num_8, row.num_9, row.ins)*2;
        result /= 3;
        if(best_chance < result) {
            best_chance = result
            best_action = "1234";
        }
    }
    if(best_action === "N/A" && row.ins > 0) {
        best_chance = getChance(db, row.num_1, row.num_2, row.num_3, row.num_4, row.num_5, row.num_6, row.num_7, row.num_8, row.num_9, row.ins-1);
    }
    sumChance += best_chance * 3;
    if(best_action === "N/A") {
        denominator += 2;
    } else {
        denominator += 3;
    }
    action_10 = best_action;

    //Roll a 11, can remove 2+9, 3+8, 4+7, 5+6, 1+2+8, 1+3+7, 1+4+6, 2+3+6, 2+4+5, 1+2+3+5
    best_chance = 0;
    best_action = "N/A"
    if (row.num_2 === 1 && row.num_9 === 1) {
        result = getChance(db, row.num_1, 0, row.num_3, row.num_4, row.num_5, row.num_6, row.num_7, row.num_8, 0, row.ins);
        best_chance = result;
        best_action = "29";
    }
    if (row.num_3 === 1 && row.num_8 === 1) {
        result = getChance(db, row.num_1, row.num_2, 0, row.num_4, row.num_5, row.num_6, row.num_7, 0, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "38";
        }
    }
    if (row.num_4 === 1 && row.num_7 === 1) {
        result = getChance(db, row.num_1, row.num_2, row.num_3, 0, row.num_5, row.num_6, 0, row.num_8, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "47";
        }
    }
    if (row.num_5 === 1 && row.num_6 === 1) {
        result = getChance(db, row.num_1, row.num_2, row.num_3, row.num_4, 0, 0, row.num_7, row.num_8, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "56";
        }
    }
    if (row.num_1 === 1 && row.num_2 === 1 && row.num_8 === 1) {
        result = getChance(db, 0, 0, row.num_3, row.num_4, row.num_5, row.num_6, row.num_7, 0, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "128";
        }
    }
    if (row.num_1 === 1 && row.num_3 === 1 && row.num_7 === 1) {
        result = getChance(db, 0, row.num_2, 0, row.num_4, row.num_5, row.num_6, 0, row.num_8, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "137";
        }
    }
    if (row.num_1 === 1 && row.num_4 === 1 && row.num_6 === 1) {
        result = getChance(db, 0, row.num_2, row.num_3, 0, row.num_5, 0, row.num_7, row.num_8, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "146";
        }
    }
    if (row.num_2 === 1 && row.num_3 === 1 && row.num_6 === 1) {
        result = getChance(db, row.num_1, 0, 0, row.num_4, row.num_5, 0, row.num_7, row.num_8, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "236";
        }
    }
    if (row.num_2 === 1 && row.num_4 === 1 && row.num_5 === 1) {
        result = getChance(db, row.num_1, 0, row.num_3, 0, 0, row.num_6, row.num_7, row.num_8, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "245";
        }
    }
    if (row.num_1 === 1 && row.num_2 === 1 && row.num_3 === 1 && row.num_5 === 1) {
        result = getChance(db, 0, 0, 0, row.num_4, 0, row.num_6, row.num_7, row.num_8, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "1235";
        }
    }
    if(best_action === "N/A" && row.ins > 0) {
        best_chance = getChance(db, row.num_1, row.num_2, row.num_3, row.num_4, row.num_5, row.num_6, row.num_7, row.num_8, row.num_9, row.ins-1);
    }
    sumChance += best_chance * 2;
    denominator += 2;
    action_11 = best_action;

    //Roll a 12, always insurance, can remove 3+9, 4+8, 5+7, 1+2+9, 1+3+8, 1+4+7, 1+5+6, 2+3+7, 2+4+6, 3+4+5, 1+2+3+6, 1+2+4+5
    best_chance = 0;
    best_action = "N/A"
    if (row.num_3 === 1 && row.num_9 === 1) {
        result = getChance(db, row.num_1, row.num_2, 0, row.num_4, row.num_5, row.num_6, row.num_7, row.num_8, 0, row.ins);
        best_chance = result;
        best_action = "39";
    }
    if (row.num_4 === 1 && row.num_8 === 1) {
        result = getChance(db, row.num_1, row.num_2, row.num_3, 0, row.num_5, row.num_6, row.num_7, 0, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "48";
        }
    }
    if (row.num_5 === 1 && row.num_7 === 1) {
        result = getChance(db, row.num_1, row.num_2, row.num_3, row.num_4, 0, row.num_6, 0, row.num_8, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "57";
        }
    }
    if (row.num_1 === 1 && row.num_2 === 1 && row.num_9 === 1) {
        result = getChance(db, 0, 0, row.num_3, row.num_4, row.num_5, row.num_6, row.num_7, row.num_8, 0, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "129";
        }
    }
    if (row.num_1 === 1 && row.num_3 === 1 && row.num_8 === 1) {
        result = getChance(db, 0, row.num_2, 0, row.num_4, row.num_5, row.num_6, row.num_7, 0, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "138";
        }
    }
    if (row.num_1 === 1 && row.num_4 === 1 && row.num_7 === 1) {
        result = getChance(db, 0, row.num_2, row.num_3, 0, row.num_5, row.num_6, 0, row.num_8, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "147";
        }
    }
    if (row.num_1 === 1 && row.num_5 === 1 && row.num_6 === 1) {
        result = getChance(db, 0, row.num_2, row.num_3, row.num_4, 0, 0, row.num_7, row.num_8, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "156";
        }
    }
    if (row.num_2 === 1 && row.num_3 === 1 && row.num_7 === 1) {
        result = getChance(db, row.num_1, 0, 0, row.num_4, row.num_5, row.num_6, 0, row.num_8, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "237";
        }
    }
    if (row.num_2 === 1 && row.num_4 === 1 && row.num_6 === 1) {
        result = getChance(db, row.num_1, 0, row.num_3, 0, row.num_5, 0, row.num_7, row.num_8, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "246";
        }
    }
    if (row.num_3 === 1 && row.num_4 === 1 && row.num_5 === 1) {
        result = getChance(db, row.num_1, row.num_2, 0, 0, 0, row.num_6, row.num_7, row.num_8, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "345";
        }
    }
    if (row.num_1 === 1 && row.num_2 === 1 && row.num_3 === 1 && row.num_6 === 1) {
        result = getChance(db, 0, 0, 0, row.num_4, row.num_5, 0, row.num_7, row.num_8, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "1236";
        }
    }
    if (row.num_1 === 1 && row.num_2 === 1 && row.num_4 === 1 && row.num_5 === 1) {
        result = getChance(db, 0, 0, row.num_3, 0, 0, row.num_6, row.num_7, row.num_8, row.num_9, row.ins);
        if(best_chance < result) {
            best_chance = result
            best_action = "1245";
        }
    }

    sumChance += best_chance;
    if (best_action !== "N/A") {denominator += 1;}
    action_12 = best_action;

    sumChance /= denominator;
    db.prepare("UPDATE results SET CHANCE = ?, action_2 = ?, action_3 = ?, action_4 = ?, action_5 = ?, action_6 = ?, action_7 = ?, action_8 = ?, action_9 = ?, action_10 = ?, action_11 = ?, action_12 = ? WHERE num_1 = ? AND num_2 = ? and num_3 = ? and num_4 = ? and num_5 = ? and num_6 = ? and num_7 = ? and num_8 = ? and num_9 = ? and ins = ?")
        .run(sumChance, action_2, action_3, action_4, action_5, action_6, action_7, action_8, action_9, action_10, action_11, action_12, row.num_1, row.num_2, row.num_3, row.num_4, row.num_5, row.num_6, row.num_7, row.num_8, row.num_9, row.ins);
}