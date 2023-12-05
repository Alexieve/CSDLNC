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

module.exports.HoSoBenhNhan_post = async (req, res) => {
    console.log(req.body);
    const MAHSBN = parseInt(req.body.MAHSBN)
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
        .input('MAHSBN', sql.Int, MAHSBN)
        .input('HOTENBN', sql.NVarChar, HOTENBN)
        .input('NGAYSINH', sql.VarChar, NGAYSINH)
        .input('GIOITINH', sql.VarChar, GIOITINH)
        .input('SDTBN', sql.VarChar, SDTBN)
        .input('DIACHIBN', sql.NVarChar, DIACHIBN)
        .input('TTSUCKHOE', sql.NVarChar, TTSUCKHOE)
        .input('TTDIUNG', sql.NVarChar, TTDIUNG)
        .execute('SP_UPDATE_HSBN');
        res.status(200).redirect('/hsbn'); 
    } catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({error: err.message})
    } finally {
        sql.close();
    }
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
        res.status(200).json({message: 'Success'}); 
    } catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({error: err.message})
    } finally {
        sql.close();
    }
}

module.exports.createLH_get = async (req, res) => {
    let MAKH = null;
    if (res.locals.user.LOAITK == 1) 
        MAKH = res.locals.user.ID;

    let listHSBN = null;
    try {
        const pool = await conn;
        listHSBN = (await pool.request()
        .input('MAKH', sql.Int, MAKH)
        .execute('SP_GET_LIST_HSBN')).recordset;
    } catch (err) {
        console.error('SQL Server Error:', err.message);
    } finally {
        sql.close();
    }

    let listMACN = null;
    try {
        const pool = await conn;
        listMACN = (await pool.request()
        .execute('SP_GET_LIST_CHINHANH')).recordset;
    } catch (err) {
        console.error('SQL Server Error:', err.message);
    } finally {
        sql.close();
    }

    let listMANS = null;
    try {
        const pool = await conn;
        listMANS = (await pool.request()
        .execute('SP_GET_LIST_NHASI_LH')).recordset;
    } catch (err) {
        console.error('SQL Server Error:', err.message);
    } finally {
        sql.close();
    }

    const groupedData = listMANS.reduce((accumulator, currentValue) => {
        const id = currentValue.MACN;
        const existingGroup = accumulator.find(group => group[0].MACN === id);
      
        if (existingGroup) {
          existingGroup.push(currentValue);
        } else {
          accumulator.push([currentValue]);
        }
      
        return accumulator;
      }, []);

    res.render('createLH', {listHSBN: JSON.stringify(listHSBN), listMACN: JSON.stringify(listMACN), listMANS: JSON.stringify(groupedData)});
}

module.exports.createLH_post = async (req, res) => {
    // console.log(req.body);
    let MANS = parseInt(req.body.MANS)
    let HOTENNS = null
    if (isNaN(MANS)) MANS = null
    else HOTENNS = req.body.HOTENNS

    const MACN = parseInt(req.body.MACN)
    const MAHSBN = parseInt(req.body.MAHSBN)
    const HOTENBN = req.body.HOTENBN
    const SDTBN = req.body.SDTBN
    const NGAYHEN = req.body.NGAYHEN
    const GIOHEN = req.body.GIOHEN +":00"
    // console.log(MACN, MANS, HOTENNS, MAHSBN, HOTENBN, SDTBN, NGAYHEN, GIOHEN)
    
    try {
        const pool = await conn;
        await pool.request()
        .input('MACN', sql.Int, MACN)
        .input('MANS', sql.Int, MANS)
        .input('MAHSBN', sql.Int, MAHSBN)
        .input('HOTENBN', sql.NVarChar, HOTENBN)
        .input('SDTBN', sql.NVarChar, SDTBN)
        .input('HOTENNS', sql.NVarChar, HOTENNS)
        .input('NGAYHEN', sql.Date, NGAYHEN)
        .input('GIOHENSTR', sql.VarChar, GIOHEN)
        .execute('SP_BOOK_APPOINMENT');
        res.status(200).json({message: 'Success'}); 
    } catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({error: err.message})
    } finally {
        sql.close();
    }
}