const {conn, sql} = require('../middleware/database')
const jwt = require('jsonwebtoken')

module.exports.getKHDT = async (req, res) => {
    let result = null;
    let MAKH = null;
    if (res.locals.user.LOAITK == 1) 
        MAKH = res.locals.user.ID;
    try {
        const pool = await conn;
        result = (await pool.request()
        .input('MAKH', sql.Int, MAKH)
        .execute('SP_GETKHDT')).recordset;
    } catch (err) {
        console.error('SQL Server Error:', err.message);
    } finally {
        sql.close();
    }
    res.render('ListKeHoachDieuTri', {KHDT: result});
}
module.exports.getKHDTBasedOnMaHSBN = async (req, res) => {
    let result = null;
    let MAHSBN = req.params.MAHSBN; // Lấy giá trị MAHSBN từ route parameter
    try {
        const pool = await conn;
        result = (await pool.request()
        .input('MAHSBN', sql.Int, MAHSBN)
        .execute('SP_GETKHDTBASEDONMAHSBN')).recordset;
    } catch (err) {
        console.error('SQL Server Error:', err.message);
    } finally {
        sql.close();
    }
    res.render('KeHoachDieuTriKH', {KHDT: result});
}
module.exports.createKHDT1_get = async (req, res) => {
    let result1 = null;
    let result2 = null;
    let result3 = null;
    let result4 = null;
    let result5 = null;
    try {
        const pool = await conn;
        result1 = (await pool.request()
        .execute('SP_LISTHSBN')).recordset;
    } catch (err) {
        console.error('SQL Server Error:', err.message);
    } finally {
        sql.close();
    }
    try {
        const pool = await conn;
        result2 = (await pool.request()
        .execute('SP_GETDIEUTRI')).recordset;
    } catch (err) {
        console.error('SQL Server Error:', err.message);
    } finally {
        sql.close();
    }
    try {
        const pool = await conn;
        result3 = (await pool.request()
        .execute('SP_GETNHASI')).recordset;
    } catch (err) {
        console.error('SQL Server Error:', err.message);
    } finally {
        sql.close();
    }
    try {
        const pool = await conn;
        result4 = (await pool.request()
        .execute('SP_GETRANG1')).recordset;
    } catch (err) {
        console.error('SQL Server Error:', err.message);
    } finally {
        sql.close();
    }
    try {
        const pool = await conn;
        result5 = (await pool.request()
        .execute('SP_LISTBEMATRANG')).recordset;
    } catch (err) {
        console.error('SQL Server Error:', err.message);
    } finally {
        sql.close();
    }
    res.render('createKHDT-1', {listHSBN: JSON.stringify(result1), DieuTri: result2, NhaSi:JSON.stringify(result3), Rang: result4, BeMatRang: result5 });
}
module.exports.createKHDT2_get = async (req, res) => {
    let MaHoSoBenhNhan =  req.params.MAHSBN;
    let result1 = null;
    let result2 = null;
    let result3 = null;
    try {
        const pool = await conn;
        result1 = (await pool.request()
        .execute('SP_GETDIEUTRI')).recordset;
    } catch (err) {
        console.error('SQL Server Error:', err.message);
    } finally {
        sql.close();
    }
    try {
        const pool = await conn;
        result2 = (await pool.request()
        .execute('SP_GETNHASI')).recordset;
    } catch (err) {
        console.error('SQL Server Error:', err.message);
    } finally {
        sql.close();
    }
    try {
        const pool = await conn;
        result3 = (await pool.request()
        .execute('SP_GETRANG1')).recordset;
    } catch (err) {
        console.error('SQL Server Error:', err.message);
    } finally {
        sql.close();
    }             
    console.log(result3.length) ;
    res.render('createKHDT-1', {MaHoSoBenhNhan,DIEUTRI: result1, listNS: JSON.stringify(result2), NhaSi: result2, RANG: result3});
}
module.exports.createKHDT_post = async (req, res) => {
    let MaHoSoBenhNhan =  req.params.MAHSBN;
    console.log(MaHoSoBenhNhan);
    res.render('createKHDT-2', {MaHoSoBenhNhan});
}