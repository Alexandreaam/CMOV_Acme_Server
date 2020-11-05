const express = require('express');
const db = require('../db')
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/:id', function(req, res, next) {
  db.query('SELECT * FROM users WHERE id = $1', [req.params.id], (err, rep) => {
    if (err) {
      return next(err)
    } else {
      res.send(rep.rows[0])
    }
  })
})

router.post('/', function(req, res, next) {

  db.query('SELECT username from users WHERE username=$1;', [req.body.username], (err, rep) => {
    if (err) {
      return next(err)
    } else if (rep.rows[0] == undefined) {
      db.query('INSERT INTO users (username, password, fullname, creditcard, nif) VALUES ( $1, $2, $3, $4, $5);', [req.body.username, req.body.password, req.body.fullname, req.body.creditcard, req.body.nif], (err2, rep) => {
        if (err2) {
          console.log(err2.message)
          return next(err2)
        } else {
          res.send(req.body)
        }
      })
    }
    else {
      res.send(JSON.parse('{"usernameTaken":"True"}'))
    }
  })
})

module.exports = router;
