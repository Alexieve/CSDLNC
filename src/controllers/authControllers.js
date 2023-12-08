const {conn, sql} = require('../middleware/database')
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
        res.status(200).json({msg: 'Login success'}); // Redirect to /home page
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
        res.status(200).json({msg: 'Đăng ký thành công!'}); // Redirect to /register page
    } catch (err) {
        // console.error('SQL Server Error:', err.message);
        res.status(400).json({error: err.message})
    } finally {
        sql.close();
    }
}

module.exports.home_get = async (req, res) => {
    let LOAITK = res.locals.user.LOAITK;
    let ID = res.locals.user.ID;
    let reportCard = null
    try{
        const pool = await conn;
        if (LOAITK == 1) {
            reportCard = await pool.request()
            .input('MAKH', sql.Int, ID)
            .execute('SP_GET_REPORT_CARD_KH');
            reportCard.recordset[0].C11 = 'Cuộc hẹn sắp tới'
            reportCard.recordset[0].C22 = 'Cuộc hẹn đã hoàn thành'
            reportCard.recordset[0].C33 = 'Kế hoạch điều trị sắp tới'
            reportCard.recordset[0].C44 = 'Kế hoạch điều trị đã hoàn thành'
            reportCard.recordset[0].C55 = 'Tổng tiền điều trị'
            reportCard.recordset[0].C66 = 'Đã thanh toán'
            reportCard.recordset[0].C77 = 'Tổng số nha sĩ'
            reportCard.recordset[0].C88 = 'Hồ sơ bệnh nhân của tài khoản'
        }
        else if (LOAITK == 2) {
            reportCard = await pool.request()
            .input('MANS', sql.Int, ID)
            .execute('SP_GET_REPORT_CARD_NS');
            reportCard.recordset[0].C11 = 'Cuộc hẹn hôm nay'
            reportCard.recordset[0].C22 = 'Cuộc hẹn đã hoàn thành'
            reportCard.recordset[0].C33 = 'Kế hoạch điều trị hôm nay'
            reportCard.recordset[0].C44 = 'Kế hoạch điều trị đã hoàn thành'
            reportCard.recordset[0].C55 = ''
            reportCard.recordset[0].C66 = ''
            reportCard.recordset[0].C77 = ''
            reportCard.recordset[0].C88 = ''
        }
        else if (LOAITK == 3) {
            reportCard = await pool.request()
            .input('MANV', sql.Int, ID)
            .execute('SP_GET_REPORT_CARD_NV');
            reportCard.recordset[0].C11 = 'Cuộc hẹn hôm nay'
            reportCard.recordset[0].C22 = 'Cuộc hẹn đang chờ xác nhận'
            reportCard.recordset[0].C33 = 'Kế hoạch điều trị hôm nay'
            reportCard.recordset[0].C44 = 'Kế hoạch điều trị đã hoàn thành'
            reportCard.recordset[0].C55 = 'Doanh thu hôm nay'
            reportCard.recordset[0].C66 = 'Doanh thu tháng'
            reportCard.recordset[0].C77 = 'Tổng số nha sĩ'
            reportCard.recordset[0].C88 = 'Tổng số hồ sơ bệnh nhân'
        }

    } catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({error: err.message})
    } finally {
        sql.close();
    }
    
    // console.log(reportCard.recordset[0])
    res.render('home', {reportCard: reportCard.recordset[0]});
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