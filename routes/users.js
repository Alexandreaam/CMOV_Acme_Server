const express = require('express');
const db = require('../db')
const router = express.Router();
const forge = require('node-forge')


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

router.post('/pastorders', function (req, res, next) {
    db.query('SELECT orderid, products, vouchers, date, total FROM orders WHERE userid = $1;', [req.body.userid], (err4, rep4) => {
        if (err4) {
            return next(err4)
        } else if (rep4 != null) {
            var r = {}
            var key = 'Pastorders'
            r[key] = []
            rep4.rows.forEach(element => {
                r[key].push(element)
            });
            res.send(r)
        }
    })
})

router.post('/', function(req, res, next) {

    db.query('SELECT username from users WHERE username=$1;', [req.body.username], (err, rep) => {
        if (err) {
            return next(err)
        } else if (rep.rows[0] == undefined) {

            var userUUID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });

            db.query('INSERT INTO users (userid, username, password, fullname, creditcard, nif) VALUES ( $1, $2, $3, $4, $5, $6);', [userUUID, req.body.username, req.body.password, req.body.fullname, req.body.creditcard, req.body.nif], (err2, rep) => {
                if (err2) {
                    console.log(err2.message)
                    return next(err2)
                } else {
                    db.query('INSERT INTO certificates (userid, certificate) VALUES ($1, $2);', 
                    [userUUID, req.body.payload], (err, rep) => {
                        if (err) {
                            console.log(err)
                            return next(err)
                        } else {
                            res.send(JSON.parse('{"username":"' + req.body.username + '","userid":"' + userUUID + '"}'))
                        }
                    })
                }
            })
            
        } else {
            res.send(JSON.parse('{"usernameTaken":"True"}'))
        }
    })
})

router.post('/login', function(req, res, next) {

    db.query('SELECT userid, password from users WHERE username=$1;', [req.body.username], (err, rep) => {
        if (err) {
            return next(err)
        } else if (rep.rows[0] != undefined) {
            if (req.body.password == rep.rows[0].password) {
                res.send(JSON.parse('{"result":"Confirmed","userid":"' + rep.rows[0].userid + '"}'))
            } else if (req.body.password != rep.rows[0].password) {
                res.send(JSON.parse('{"result":"Wrong"}'))
            }
        } else {
            res.send(JSON.parse('{"result":"Nonexistent"}'))
        }
    })
})

router.post('/cert', function(req, res, next) {
    console.log(req.body.payload)
    try{
        let certificate = forge.pki.certificateFromPem(req.body.payload)

        var userUUID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        console.log(certificate)
        db.query('INSERT INTO certificates (userid, certificate) VALUES ($1, $2);', 
        [userUUID, req.body.payload], (err, rep) => {
            if (err) {
                console.log(err)
                return next(err)
            } else {
                res.send(JSON.parse('{"result":"result"}'))
            }
        })

    } catch (e) {
        console.log(e)
    }
})

module.exports = router;
