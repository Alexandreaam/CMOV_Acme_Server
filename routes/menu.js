var express = require('express');
const db = require('../db')
var router = express.Router();

/* GET menu listing. */
router.get('/', function(req, res, next) {
  db.query('SELECT * from products;', (err, rep) => {
    if (err) {
      return next(err)
    } else if (rep != null) {
      var r = {}
      var key = 'Products'
      r[key] = []
      rep.rows.forEach(element => {
        console.log(element)
        r[key].push(element)
      });
      console.log(r)

      res.send(r)
    }
    else {
      res.send(JSON.parse('{"usernameTaken":"True"}'))
    }
  })
});

module.exports = router;
