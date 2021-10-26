const { Pool } = require("pg");

// console.log(process.env);

// const { PGUSER, PGHOST, PGPASSWORD, PGDATABASE, PGPORT } = process.env;

// const pool = new Pool({
//   user: PGUSER,
//   host: PGHOST,
//   database: PGDATABASE,
//   password: PGPASSWORD,
//   port: PGPORT,
// });

const pool = new Pool();

module.exports = {
  query: (text, params) => {
    console.log({
      request: text,
      time: new Date().toLocaleTimeString(),
    });
    return pool.query(text, params);
  },
};
