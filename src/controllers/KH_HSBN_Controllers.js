const {conn, sql} = require('../middleware/database')
const jwt = require('jsonwebtoken')

module.exports.HoSoBenhNhan_get = async (req, res) => {
    let result = null;
    let MAKH = null;
    if (res.locals.user.LOAITK == 1) 
        MAKH = res.locals.user.ID;

    try {
        const pool = await conn;
        result = (await pool.request()
        .input('MAKH', sql.Int, MAKH)
        .execute('SP_GET_LIST_HSBN')).recordset;
    } catch (err) {
        console.error('SQL Server Error:', err.message);
    } finally {
        sql.close();
    }
    res.render('listHSBN', {HSBN: result});
}

module.exports.createHSBN_get = (req, res) => {
    res.render('createHSBN');
}

module.exports.createHSBN_post = async (req, res) => {
    const LOAITK = req.body.LOAITK
    let MAKH = null
    if (LOAITK == 1)
        MAKH = req.body.MAKH
    const HOTENBN = req.body.HOTENBN
    const NGAYSINH = req.body.NGAYSINH
    const GIOITINH = req.body.GIOITINH
    const SDTBN = req.body.SDTBN
    const DIACHIBN = req.body.DIACHIBN
    const TTSUCKHOE = req.body.TTSUCKHOE
    const TTDIUNG = req.body.TTDIUNG

    try {
        const pool = await conn;
        await pool.request()
        .input('MAKH', sql.Int, MAKH)
        .input('HOTENBN', sql.NVarChar, HOTENBN)
        .input('NGAYSINH', sql.VarChar, NGAYSINH)
        .input('GIOITINH', sql.VarChar, GIOITINH)
        .input('SDTBN', sql.VarChar, SDTBN)
        .input('DIACHIBN', sql.NVarChar, DIACHIBN)
        .input('TTSUCKHOE', sql.VarChar, TTSUCKHOE)
        .input('TTDIUNG', sql.VarChar, TTDIUNG)
        .execute('SP_CREATE_HSBN');
        res.status(200).redirect('/hsbn'); 
    } catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({error: err.message})
    } finally {
        sql.close();
    }
}