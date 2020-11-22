var express = require('express');
const db = require('../db')
var router = express.Router();

/* GET menu listing. */
router.post('/', function(req, res, next) {
    db.query('SELECT * FROM products;', (err, rep) => {
        if (err) {
            return next(err)
        } else if (rep != null) {
            var r = {}
            var key = 'Products'
            r[key] = []
            rep.rows.forEach(element => {
                r[key].push(element)
            });
            db.query('SELECT * FROM vouchers WHERE userid = $1 AND used = false;', [req.body.userid], (err2, rep2) => {
                if (err2) {
                    return next(err2)
                } else if (rep2 != null) {
                    var key = 'Vouchers'
                    r[key] = []
                    rep2.rows.forEach(element => {
                        r[key].push(element)
                    });
                    db.query('SELECT coffeecount, totalspendings, tempcoffeecount, tempspendings FROM users WHERE userid = $1;', [req.body.userid], (err3, rep3) => {
                        if (err3) {
                            return next(err3)
                        } else if (rep3 != null) {
                            var key = 'Userdata'
                            r[key] = []
                            rep3.rows.forEach(element => {
                                r[key].push(element)
                            });
                            db.query('SELECT orderid, products, vouchers, date, total FROM orders WHERE userid = $1;', [req.body.userid], (err4, rep4) => {
                                if (err4) {
                                    return next(err4)
                                } else if (rep4 != null) {
                                    var key = 'Pastorders'
                                    r[key] = []
                                    rep4.rows.forEach(element => {
                                        r[key].push(element)
                                    });
                                    res.send(r)
                                }
                            })
                        }
                    })
                }
            })
        } else {
            res.send(JSON.parse('{"usernameTaken":"True"}'))
        }
    })
});

module.exports = router;