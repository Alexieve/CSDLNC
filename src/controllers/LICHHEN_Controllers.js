const {conn, sql} = require('../middleware/database')

module.exports.createLH_get = async (req, res) => {
    res.render('createLH');
}

module.exports.search_hsbn_get = async (req, res) => {
    const keyword = req.query.keyword.toLowerCase();
    let MAKH = res.locals.user.ID;
    if (res.locals.user.LOAITK > 1)
        MAKH = null;
    try {
        const pool = await conn;
        const result = (await pool.request()
        .input('MAKH', sql.Int, MAKH)
        .input('KEYWORD', sql.NVarChar, keyword)
        .execute('SP_SEARCH_HSBN_KEYWORD')).recordset
        res.status(200).json(result); 
    } catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({error: err.message})
    } finally {
        sql.close();
    }
}

module.exports.search_chinhanh_get = async (req, res) => {
    const keyword = req.query.keyword.toLowerCase();
    try {
        const pool = await conn;
        const result = (await pool.request()
        .input('KEYWORD', sql.NVarChar, keyword)
        .execute('SP_SEARCH_CHINHANH_KEYWORD')).recordset
        res.status(200).json(result); 
    } catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({error: err.message})
    } finally {
        sql.close();
    }
}

module.exports.search_nhasi_get = async (req, res) => {
    const MACN = req.params.MACN;
    const keyword = req.query.keyword.toLowerCase();
    // console.log(MACN, keyword)
    try {
        const pool = await conn;
        const result = (await pool.request()
        .input('MACN', sql.Int, MACN)
        .input('KEYWORD', sql.NVarChar, keyword)
        .execute('SP_SEARCH_NHASI_KEYWORD')).recordset
        res.status(200).json(result); 
    } catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({error: err.message})
    } finally {
        sql.close();
    }
}

module.exports.createLH_post = async (req, res) => {
    // console.log(req.body);
    let MANS = null
    let HOTENNS = null
    if (req.body.MANS != '') {
        MANS = JSON.parse(req.body.MANS).MANS
        HOTENNS = req.body.HOTENNS
    }

    const MACN = JSON.parse(req.body.MACN).MACN
    const MAHSBN = JSON.parse(req.body.MAHSBN).MAHSBN
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