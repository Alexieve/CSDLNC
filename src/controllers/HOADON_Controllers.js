const {conn, sql} = require('../middleware/database')
const jwt = require('jsonwebtoken')

module.exports.Hoadon_get = async (req, res) => {
    let result = null;
    try {
        const pool = await conn;
        result = (await pool.request().execute('SP_GET_LIST_HOADON')).recordset
    } catch (err) {
        console.error('SQL Server Error:', err.message);
    } finally {
        sql.close();
    }
    res.render('listHoadon', {Hoadon: result});
}

module.exports.createHoadon_get = async (req, res) => {
    let result = null;
    try {
        const pool = await conn;
        result = (await pool.request().execute('SP_GET_LIST_KH')).recordset
    } catch (err) {
        console.error('SQL Server Error:', err.message);
    } finally {
        sql.close();
    }
    res.render('createHoadon', {listKH: JSON.stringify(result), NVTHANHTOAN: res.locals.user.ID});
}

module.exports.createHoadon_post = async (req, res) => {
    let MAKH = null
    let NGAYTT = new Date(req.body.NGAYTT)
    let NGUOITT = req.body.NGUOITT
    let TONGTIENCANTT = parseInt(req.body.TONGTIENCANTT)
    let SOTIENNHAN = parseInt(req.body.SOTIENNHAN)
    let SOTIENTHOI = parseInt(req.body.SOTIENTHOI)
    let LOAITT = req.body.LOAITT
    if (LOAITT == 'Chuyển khoản' || LOAITT == 'Ví điện tử')
        MAKH = parseInt(req.body.MAKH)
    let NVTHANHTOAN = parseInt(req.body.NVTHANHTOAN)
    let MAKHDIEUTRI = req.body.MAKHDIEUTRI.split(',')
    // console.log(MAKH, NGAYTT, NGUOITT, TONGTIENCANTT, SOTIENNHAN, SOTIENTHOI, LOAITT, NVTHANHTOAN, MAKHDIEUTRI)
    try {
        const pool = await conn;
        let MAHDTT = null;
        const result = await pool.request()
        .input('MAKH', sql.Int, MAKH)
        .input('NGAYTT', sql.Date, NGAYTT)
        .input('NGUOITT', sql.NVarChar, NGUOITT)
        .input('TONGTIENCANTT', sql.Int, TONGTIENCANTT)
        .input('SOTIENNHAN', sql.Int, SOTIENNHAN)
        .input('SOTIENTHOI', sql.Int, SOTIENTHOI)
        .input('LOAITT', sql.NVarChar, LOAITT)
        .input('NVTHANHTOAN', sql.Int, NVTHANHTOAN)
        .output('MAHDTT', sql.Int, MAHDTT)
        .execute('SP_POST_CREATE_HOADON');
        MAHDTT = result.output.MAHDTT
        for(var i=0; i < MAKHDIEUTRI.length; i++) {
            await pool.request()
            .input('MAKHDIEUTRI', sql.Int, parseInt(MAKHDIEUTRI[i]))
            .input('MAHDTT', sql.Int, MAHDTT)
            .execute('SP_UPDATE_KHDT');
        }
        res.status(200).json({success: 'Tạo hóa đơn thành công'}); 
    } catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({error: err.message})
    } finally {
        sql.close();
    }
}

module.exports.khdt_get = async (req, res) => {
    let result = null;
    let MAKH = req.query.value;
    try {
        const pool = await conn;
        if (MAKH != -1)
            result = (await pool.request().input('MAKH', sql.Int, MAKH).execute('SP_GET_LIST_KHDIEUTRI_THEO_MAKH')).recordset
        else
            result = (await pool.request().execute('SP_GET_LIST_KHDIEUTRI')).recordset
    } catch (err) {
        console.error('SQL Server Error:', err.message);
    } finally {
        sql.close();
    }
    res.json(result)
}