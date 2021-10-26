const express = require("express");
require("dotenv").config();
const app = express();
const db = require("./database/client");
const { fighterValidation } = require("./validations/validations");
const { validationResult } = require("express-validator");

app.use(express.json()); // attach the data to req.body === {} || { key: value}

app.get("/time", async (req, res) => {
  // Syntax number 1: callbacks
  //   pool.query("SELECT NOW()", (err, dbData) => {
  //     if (err) return res.sendStatus(500)
  //     res.send(dbData.rows[0]);
  //   });

  // Syntax number 2: promises
  db.query("SELECT NOW()")
    .then((dbData) => res.send(dbData.rows[0]))
    .catch((err) => res.sendStatus(500));

  // Syntax number 3: async/await (promises)
  //   try {
  //     const { rows } = await db.query("SELECT NOW()");
  //     res.send(rows[0]);
  //   } catch (err) {
  //     res.sendStatus(500);
  //   }
});

app.get("/api/fighters", (req, res) => {
  db.query("SELECT * FROM fighters ORDER BY id ASC")
    .then((data) => res.json(data.rows))
    .catch((err) => res.sendStatus(500));
});

app.get("/api/fighters/:id", (req, res) => {
  const { id } = req.params; // === { id: 1, country: 'Thailand'  } ==> Object destructuring in JS

  // parameterized queries
  const getOneFighter = {
    text: "SELECT * FROM fighters WHERE id = $1",
    values: [id],
  };

  db
    // .query("SELECT * FROM fighters WHERE id = $1", [id])
    .query(getOneFighter)
    .then((data) => res.json(data.rows))
    .catch((err) => res.sendStatus(500));
});

app.post("/api/fighters", fighterValidation, (req, res) => {
  //   console.log(req.body);
  const { first_name, last_name, country_id, style } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }

  //   if (
  //     !first_name ||
  //     !last_name ||
  //     !country_id ||
  //     !style ||
  //     first_name.length < 2 ||
  //     last_name.length < 2 ||
  //     style.length < 2
  //   ) {
  //     return res
  //       .status(400)
  //       .send("Please provide valid data to create a fighter");
  //   }

  const createOneFighter = {
    text: `
    INSERT INTO fighters(first_name, last_name, country_id, style)
    VALUES($1,$2,$3,$4)
    RETURNING *
    `,
    values: [first_name, last_name, country_id, style],
  };

  db.query(createOneFighter)
    .then((data) => res.status(201).json(data.rows))
    .catch((err) => res.sendStatus(500));
});

app.put("/api/fighters/:id", fighterValidation, (req, res) => {
  const { first_name, last_name, country_id, style } = req.body;
  const { id } = req.params;

  const updateOneFighter = {
    text: `
    UPDATE fighters
    SET first_name=$1, last_name=$2, country_id=$3, style=$4
    WHERE id=$5
    RETURNING *
    `,
    values: [first_name, last_name, country_id, style, id],
  };

  db.query(updateOneFighter)
    .then((data) => res.json(data.rows))
    .catch((err) => res.sendStatus(500));
});

app.delete("/api/fighters/:id", (req, res) => {
  const { id } = req.params;

  const deleteFighter = {
    text: `
        DELETE FROM fighters
        WHERE id = $1
        RETURNING *
        `,
    values: [id],
  };

  db.query(deleteFighter)
    .then((data) => {
      if (!data.rows.length) {
        return res.status(404).send("No such fighter!");
      }
      res.json(data.rows);
    })
    .catch((err) => res.sendStatus(500));
});

app.get("/", (req, res) => {
  res.send("Welcome to the Internet Martial Artists Database!");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
