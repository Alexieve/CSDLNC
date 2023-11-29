const {conn, sql} = require('../middleware/database')
const KhachHang = require('../models/KhachHang')
const jwt = require('jsonwebtoken')

const maxAge = 3 * 24 * 60 * 60;
const createToken = (user) => {
    return jwt.sign({user}, 'information of user', {
        expiresIn: maxAge
    })
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.login_post = async (req, res) => {
    // console.log(req.body)
    const SDT = req.body.SDT
    const MATKHAU = req.body.MATKHAU
    const LOAITK = parseInt(req.body.LOAITK) // Convert LOAITK to an integer

    try {
        const pool = await conn;
        const result = await pool.request()
        .input('SDT', sql.VarChar, SDT)
        .input('MATKHAU', sql.VarChar, MATKHAU)
        .input('LOAITK', sql.Int, LOAITK)
        .output('ID', sql.Int)
        .output('HOTEN', sql.NVarChar)
        .output('LOAINV', sql.Bit)
        .execute('SP_LOGIN_KHACHHANG');
        const user = {"ID": result.output.ID, "HOTEN":result.output.HOTEN, "LOAITK": LOAITK, "LOAINV": result.output.LOAINV}
        const token = createToken(user)
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
        res.locals.user = user;
        res.status(200).redirect('/'); // Redirect to /home page
    } catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({error: err.message})
    } finally {
        sql.close();
    }
}

module.exports.register_get = (req, res) => {
    res.render('register');
}

module.exports.register_post = async (req, res) => {
    // console.log(req.body)
    const HOTEN = req.body.HOTEN
    const SDT = req.body.SDT
    const EMAIL = req.body.EMAIL
    const MATKHAU = req.body.MATKHAU

    try {
        const pool = await conn;
        await pool.request()
        .input('HOTEN', sql.NVarChar, HOTEN)
        .input('SDT', sql.VarChar, SDT)
        .input('EMAIL', sql.VarChar, EMAIL)
        .input('MATKHAU', sql.VarChar, MATKHAU)
        .execute('SP_REGISTER_KHACHHANG');
        res.status(200).redirect('/login'); // Redirect to /register page
    } catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({error: err.message})
    } finally {
        sql.close();
    }
}

module.exports.home_get = (req, res) => {
    res.render('home');
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.locals.user = null;
    res.redirect('/login')
}

module.exports.blank_get = (req, res) => {
    res.render('blank');
}

module.exports.tables_get = (req, res) => {
    res.render('tables');
}