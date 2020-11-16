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
                r[key].push(element)
            });
            db.query('SELECT * from vouchers where userid = 1;', (err2, rep2) => {
                if (err2) {
                    return next(err2)
                } else if (rep2 != null) {
                    var key = 'Vouchers'
                    r[key] = []
                    rep2.rows.forEach(element => {
                        r[key].push(element)
                    });
                    res.send(r)
                }
            })
        } else {
            res.send(JSON.parse('{"usernameTaken":"True"}'))
        }
    })
});

module.exports = router;