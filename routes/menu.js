var express = require('express');
const db = require('../db')
var router = express.Router();

/* GET menu listing. */
router.get('/', function(req, res, next) {
  db.query('SELECT * from products;', (err, rep) => {
    if (err) {
      return next(err)
    } else if (rep != null) {
      console.log(rep)
      res.send(rep.rows)
    }
    else {
      res.send(JSON.parse('{"usernameTaken":"True"}'))
    }
  })
});

module.exports = router;
