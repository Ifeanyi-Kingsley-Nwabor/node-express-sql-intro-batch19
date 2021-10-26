const { check } = require("express-validator");

const fighterValidation = [
  check("first_name").not().isEmpty().isAlpha().isLength({ min: 2 }),
  check("last_name").not().isEmpty().isAlpha().isLength({ min: 2 }),
  check("country_id", "The country ID should be between 0 and 99")
    .not()
    .isEmpty()
    .isInt({ min: 0, max: 99 }),
  check("style").not().isEmpty().isLength({ min: 2 }),
];

module.exports = {
  fighterValidation,
};
