const jwt = require('jsonwebtoken');
const Account = require('../models/KhachHang');
const {conn, sql} = require('../middleware/database')

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'information of user', (err, decodedToken) => {
            if (err) {
                // console.log(err.message);
                res.redirect('/login');
            }
            else {
                // console.log("Deny Guest's Access");
                next();
            }
        })
    }
    else {
        res.redirect('/login');
    }
}

// prevent login again
const preventLoginAgain = (req, res, next) => {
    const token = req.cookies.jwt; 

    if (token) {
        jwt.verify(token, 'information of user', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                next();
            }
            else {
                // console.log('Prevent Login Success');
                res.redirect('/');
            }
        })
    }
    else {
        next();
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'information of user', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            }
            else {
                res.locals.user = decodedToken.user;
                next();
            }
        })
    }
    else {
        res.locals.user = null;
        next();
    }
}

const requirePermission = (requiredPermission) => {
    return (req, res, next) => {
        const token = req.cookies.jwt;
        if (token) {
            jwt.verify(token, 'information of user', async (err, decodedToken) => {
                if (err) {
                    console.log(err.message);
                    res.redirect('/login');
                } else {
                    const user = decodedToken.user;
                    if (user && user.LOAINV >= requiredPermission) {
                        res.locals.user = user;
                        next();
                    } else {
                        res.status(404).render('error404')
                    }
                }
            });
        } else {
            res.redirect('/login');
        }
    };
};
module.exports = {requireAuth, checkUser, preventLoginAgain,requirePermission};
