var express = require('express');
const db = require('../db')
var router = express.Router();

router.post('/', function(req, res, next) {
    var datetime = new Date();
    var date = datetime.getFullYear() + '-' + (datetime.getMonth() + 1) + '-' + datetime.getDate()

    db.query("INSERT INTO orders (userid, products, vouchers, date, total) VALUES ( $1, $2, $3, $4, $5);", [req.body.userid, req.body.Products, req.body.Vouchers, date, req.body.Total], (err, rep) => {
        if (err) {
            console.log(err)
            return next(err)
        } else {
            var totalCoffee = 0
            var totalSpending = 0
            var newCoffee = 0

            db.query('SELECT coffeecount, totalspendings from users where userid = $1;', [req.body.userid], (err2, rep2) => {
                if (err2) {
                    console.log(err)
                    return next(err2)
                } else {
                    totalCoffee = rep2.rows[0].coffeecount
                    totalSpending = rep2.rows[0].totalspendings

                    var prods = JSON.parse(req.body.Products)
                    for (var prod in prods) {
                        if (prods.hasOwnProperty(prod)) {
                            if (prod == 4) {
                                console.log("Asked for " + prods[prod] + " coffees!")
                                newCoffee = prods[prod]
                            }
                            //console.log(prod + " -> " + prods[prod]);
                        }
                    }
                    var newTotalSpending = totalSpending + req.body.Total
                    var newTotalCoffee = totalCoffee + newCoffee

                    console.log("User " + req.body.userid + ":\nTotal Coffee: " + totalCoffee + " -> " + newTotalCoffee + "\nTotal Spending: " + totalSpending + " -> " + newTotalSpending)

                    db.query('UPDATE users SET coffeecount = $1, totalspendings = $2 WHERE userid = $3;', [newTotalCoffee, newTotalSpending, req.body.userid], (err3, rep3) => {
                        if (err3) {
                            console.log(err3)
                            return next(err3)
                        } else {
                            res.send(JSON.parse('{"Order":"Success"}'))

                        }
                    })
                }
            })
        }
    })
});


module.exports = router;