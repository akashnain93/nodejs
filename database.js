import sqlite3 from "sqlite3";

const sql = sqlite3.verbose();

const DBSOURCE = "db.sqlite";

let con = new sql.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
    
    con.run(
      "CREATE TABLE product (id INTEGER,name text,category text,retail_price INTEGER,discounted_price INTEGER,availability BIT)"
      ,(err) => {
        console.log("product Table Created")
    });

  }
});

export default con;
