const { Pool } = require("pg");

const { database } = require("./keys");

const pool = new Pool(database);

pool.connect((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("DATABASE CONNECTION WAS CLOSED");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("DATABASE  HAS TO MANY CONNECTIONS");
    }
    if (err.code === " ECONNREFUSED") {
      console.error("DATABASE CONNECTION WAS REFUSED");
    }
  }

  if (connection) {
    connection.release();
    console.log("DB is Connected");
    return;
  }
});

module.exports = pool;
