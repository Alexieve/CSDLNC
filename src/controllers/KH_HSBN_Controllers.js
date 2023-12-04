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
        res.status(200).redirect('/hsbn'); 
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
      
        // Check if there is an array for the current id in the accumulator
        const existingGroup = accumulator.find(group => group[0].MACN === id);
      
        if (existingGroup) {
          // If the group already exists, push the current object to that group
          existingGroup.push(currentValue);
        } else {
          // If not, create a new group with the current object
          accumulator.push([currentValue]);
        }
      
        return accumulator;
      }, []);

    res.render('createLH', {listHSBN: JSON.stringify(listHSBN), listMACN: listMACN, listMANS: JSON.stringify(groupedData)});
}

module.exports.createLH_post = async (req, res) => {
    console.log(req.body);
    let MANS = parseInt(req.body.MANS)
    const MAHSBN = parseInt(req.body.MAHSBN)
    const NGAYHEN = req.body.NGAYHEN
    const GIOHEN = req.body.GIOHEN
    
    if (isNaN(MAHSBN)) {
        res.status(400).json({error: 'Vui lòng chọn hồ sơ bệnh nhân phù hợp!'});
        return;
    }
    else if (isNaN(MANS)) {
        if (req.body.MANS != '') {
            res.status(400).json({error: 'Vui lòng chọn nha sĩ phù hợp!'});
            return;
        }
        else MANS = null
    }

    console.log(MANS, MAHSBN, NGAYHEN, GIOHEN);

    try {
        // const pool = await conn;
        // await pool.request()
        // .input('MAHSBN', sql.Int, MAHSBN)
        // .input('MACN', sql.Int, MACN)
        // .input('MANS', sql.Int, MANS)
        // .input('NGAYKHAM', sql.VarChar, NGAYKHAM)
        // .input('TINHTRANG', sql.NVarChar, TINHTRANG)
        // .input('CHANDOAN', sql.NVarChar, CHANDOAN)
        // .input('GHICHU', sql.NVarChar, GHICHU)
        // .execute('SP_CREATE_LH');
        res.status(200).json({message: 'Success'}); 
    } catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({error: err.message})
    } finally {
        sql.close();
    }
}