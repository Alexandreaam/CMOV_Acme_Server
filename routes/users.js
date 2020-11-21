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
            db.query('INSERT INTO users (userid, username, password, fullname, creditcard, nif) VALUES ( $1, $2, $3, $4, $5, $6);', [req.body.userid, req.body.username, req.body.password, req.body.fullname, req.body.creditcard, req.body.nif], (err2, rep) => {
                if (err2) {
                    console.log(err2.message)
                    return next(err2)
                } else {
                    db.query('SELECT userid from users WHERE username=$1;', [req.body.username], (err3, rep3) => {
                        if (err3) {
                            console.log(err3.message)
                            return next(err3)
                        } else {
                            res.send(JSON.parse('{"username":"' + req.body.username + '","userid":"' + rep3.rows[0].userid + '"}'))
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

/*
router.post('/cert', function(req, res, next) {

  X509Certificate2 c = new X509Certificate2(Encoding.ASCII.GetBytes(req));
  CertData data = new CertData();

  data.subject = c.Subject;
  data.issuer = c.Issuer;
  data.version = c.Version.ToString();
  data.sdate = c.NotBefore.ToString();
  data.edate = c.NotAfter.ToString();
  data.thumb = c.Thumbprint;
  data.serial = c.SerialNumber;
  data.friendly = c.PublicKey.Oid.FriendlyName;
  data.pkencoding = c.PublicKey.EncodedKeyValue.Format(true);

})
*/
module.exports = router;