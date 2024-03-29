var express = require('express');
const db = require('../db')
var router = express.Router();

router.post('/delete', function(req, res, next) {

    db.query('DELETE FROM orders WHERE orderid = $1;', [req.body.orderid],  (err, prodData) => {
        if (err) {
            console.log(err)
            return next(err)
        } else
            res.send(JSON.parse('{"Deletion":"Success"}'))
    })
})

router.post('/', function(req, res, next) {
    var datetime = new Date();
    var date = datetime.getFullYear() + '-' + (datetime.getMonth() + 1) + '-' + datetime.getDate()
    var terminalProducts = ""
    var terminalVouchers = ""
    var terminalPrice = ""
    var terminalEarned = ""
    var totalCalculated = req.body.Total

    db.query("INSERT INTO orders (userid, products, vouchers, date, total) VALUES ( $1, $2, $3, $4, $5) RETURNING orderid;", [req.body.userid, req.body.Products, req.body.Vouchers, date, req.body.TotalDiscounted], (err, rep) => {
        if (err) {
            console.log(err)
            return next(err)
        } else {

            db.query('SELECT coffeecount, totalspendings, tempcoffeecount, tempspendings from users where userid = $1;', [req.body.userid], (err2, rep2) => {
                if (err2) {
                    console.log(err2)
                    return next(err2)
                } else {
                    db.query('SELECT productid, title FROM products;', (err, prodData) => {
                        if (err) {
                            return next(err)
                        } else {
                            var totalCoffee = rep2.rows[0].coffeecount
                            var totalSpending = rep2.rows[0].totalspendings
                            var newCoffee = 0

                            var prods = JSON.parse(req.body.Products)
                            for (var prod in prods) {
                                if (prods.hasOwnProperty(prod)) {
                                    if (prod == 4) {
                                        console.log("Asked for " + prods[prod] + " coffees!")
                                        newCoffee = prods[prod]
                                    }
                                    terminalProducts += (prodData.rows[prod-1].title + " x " + prods[prod].toString() + "@")
                                    //console.log(prod + " -> " + prods[prod]);

                                }
                            }

                            var discountedCoffees = 0
                            var appliedCoffeeVouchers = []
                            var discountPercent = 0
                            var appliedPercentVouchers = []
                            var vouchers = []
                            var usedVouchers = {}

                            var vouchs = JSON.parse(req.body.Vouchers)
                            for (var vouch in vouchs) {
                                if (vouchs.hasOwnProperty(vouch)) {
                                        vouchers.push(vouch)
                                }
                            }

                            var usableCoffeeVouchers = []
                            var usableDiscountVouchers = []

                            db.query('SELECT vouchid, used, type FROM vouchers WHERE userid = $1;', [req.body.userid], (err3, rep3) => {
                                if (err3) {
                                    console.log(err3)
                                    return next(err3)
                                } else {
                                    rep3.rows.forEach(element => {

                                        vouchers.forEach(untestedVoucher => {
                                            if((untestedVoucher == element.vouchid) && element.used == false){
                                                if(element.type == true){
                                                    discountedCoffees++
                                                    usableCoffeeVouchers.push(element.vouchid)
                                                }
                                                if(element.type == false){
                                                    discountPercent++
                                                    usableDiscountVouchers.push(element.vouchid)
                                                }
                                            } else if((untestedVoucher == element.vouchid) && element.used == true){

                                            }
                                        });
                                    });
                                                                      

                                    var excess = 0
                                    if (newCoffee < discountedCoffees) {
                                        excess = discountedCoffees - newCoffee
                                        newCoffee = 0
                                        console.log("Used " + excess + " excess coffee vouchers")
                                    } else if (newCoffee > discountedCoffees) {
                                        newCoffee = newCoffee - discountedCoffees
                                        console.log("Discounted " + discountedCoffees + " coffees, paid for " + newCoffee)
                                    } else {
                                        newCoffee = 0
                                        console.log("All coffees were discounted!")
                                    }


                                    for (var i = 0; i < (discountedCoffees - excess); i++) {
                                        db.query('UPDATE vouchers SET used = true WHERE vouchid = $1;', [usableCoffeeVouchers[i]], (err3, rep3) => {
                                            if (err3) {
                                                console.log(err3)
                                                return next(err3)
                                            } else {
                                            }
                                        })
                                        totalCalculated -= 0.50
                                        usedVouchers[usableCoffeeVouchers[i]] = true
                                    }

                                    if ((discountedCoffees - excess) > 0) {
                                        terminalVouchers += "Applied " + (discountedCoffees - excess) + " Free Coffee Vouchers@"
                                    }


                                    if (discountPercent > 0) {
                                        terminalVouchers += "Applied 5% Discount Voucher@"
                                        if (discountPercent > 1)
                                            console.log("More than one 5% discount used, ignoring excess")
                                        db.query('UPDATE vouchers SET used = true WHERE vouchid = $1;', [usableDiscountVouchers[0]], (err3, rep3) => {
                                            if (err3) {
                                                console.log(err3)
                                                return next(err3)
                                            } else {
                                            }
                                        })
                                        totalCalculated *= 0.95
                                        usedVouchers[usableDiscountVouchers[i]] = false
                                    }

                                    var newTempSpending = rep2.rows[0].tempspendings + req.body.Total
                                    var newTempCoffee = rep2.rows[0].tempcoffeecount + newCoffee

                                    if (newTempSpending >= 100) {
                                        var reward = parseInt(newTempSpending / 100, 10)
                                        terminalEarned += "You earned " + reward + " 5% Discount Vouchers!@"
                                        console.log("User earned " + reward + " 5% Discount Vouchers!")
                                        newTempSpending = newTempSpending - (reward * 100)

                                        db.query("Select * FROM defaultvouchers WHERE type = false;", (err, rep) => {
                                            if (err) {
                                                console.log(err)
                                                return next(err)
                                            } else {

                                                for (var i = 0; i < reward; i++) {
                                                    var vouchUUID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                                                        var r = Math.random() * 16 | 0,
                                                            v = c == 'x' ? r : (r & 0x3 | 0x8);
                                                        return v.toString(16);
                                                    });
                                                    db.query("INSERT INTO vouchers (vouchid, userid, title, details, image, type, used) VALUES ( $1, $2, $3, $4, $5, $6, $7);", [vouchUUID, req.body.userid, rep.rows[0].title, rep.rows[0].details, rep.rows[0].image, rep.rows[0].type, false], (err, rep) => {
                                                        if (err) {
                                                            console.log(err)
                                                            return next(err)
                                                        } else {

                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    }
                                    if (newTempCoffee >= 3) {
                                        var reward = parseInt(newTempCoffee / 3, 10)
                                        terminalEarned += "You earned " + reward + " free coffee Discount Vouchers!@"
                                        console.log("User earned " + reward + " free coffee Discount Vouchers!")
                                        newTempCoffee = newTempCoffee - (reward * 3)

                                        db.query("Select * FROM defaultvouchers WHERE type = true;", (err, rep) => {
                                            if (err) {
                                                console.log(err)
                                                return next(err)
                                            } else {

                                                for (var i = 0; i < reward; i++) {
                                                    var vouchUUID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                                                        var r = Math.random() * 16 | 0,
                                                            v = c == 'x' ? r : (r & 0x3 | 0x8);
                                                        return v.toString(16);
                                                    });
                                                    db.query("INSERT INTO vouchers (vouchid, userid, title, details, image, type, used) VALUES ( $1, $2, $3, $4, $5, $6, $7);", [vouchUUID, req.body.userid, rep.rows[0].title, rep.rows[0].details, rep.rows[0].image, rep.rows[0].type, false], (err, rep) => {
                                                        if (err) {
                                                            console.log(err)
                                                            return next(err)
                                                        } else {

                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    }


                                    var newTotalSpending = totalSpending + totalCalculated
                                    var newTotalCoffee = totalCoffee + newCoffee

                                    terminalPrice += "Total Price: " + totalCalculated + "€"

                                    console.log("\nUser " + req.body.userid + ":\nTotal Coffee: " + totalCoffee + " -> " + newTotalCoffee + "\nTotal Spending: " + totalSpending + " -> " + newTotalSpending + "\n")

                                    db.query('UPDATE users SET coffeecount = $1, totalspendings = $2, tempcoffeecount = $3, tempspendings = $4 WHERE userid = $5;', [newTotalCoffee, newTotalSpending, newTempCoffee, newTempSpending, req.body.userid], (err3, rep3) => {
                                        if (err3) {
                                            console.log(err3)
                                            return next(err3)
                                        } else {
                                            db.query('UPDATE orders SET total = $1, vouchers = $2 WHERE orderid = $3;', [totalCalculated, JSON.stringify(usedVouchers), rep.rows[0].orderid], (err4, rep4) => {
                                                if (err4) {
                                                    console.log(err4)
                                                    return next(err4)
                                                } else {
                                                    res.send(JSON.parse('{"Order":"Success","Orderid":' + rep.rows[0].orderid + ',"Vouchers":' + JSON.stringify(usedVouchers) + ',"Total":' + totalCalculated + ',"terminalProducts":"' + terminalProducts.toString() + '","terminalVouchers":"' + terminalVouchers.toString() + '","terminalPrice":"' + terminalPrice.toString() + '","terminalEarned":"' + terminalEarned.toString() + '"}'))
        
                                                }
                                            })

                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
});


module.exports = router;