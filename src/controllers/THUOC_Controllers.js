const {conn, sql} = require('../middleware/database')
const jwt = require('jsonwebtoken')

module.exports.Thuoc_get = async (req, res) => {
    let result = null;
    try {
        const pool = await conn;
        result = (await pool.request().execute('SP_GET_LIST_THUOC')).recordset                          
    } catch (err) {
        console.error('SQL Server Error:', err.message);
    } finally {
        sql.close();
    }
    res.render('listThuoc', {Thuoc: result});
}

module.exports.createThuoc_get = (req, res) => {
    res.render('createThuoc');
}

module.exports.createThuoc_post = async (req, res) => {
    const TENTHUOC = req.body.TENTHUOC
    const CONGDUNG = req.body.CONGDUNG
    const CHONGCHIDINH = req.body.CHONGCHIDINH
    const TACDUNGPHU = req.body.TACDUNGPHU
    const HDSD = req.body.HDSD
    const HSD = req.body.HSD
    const NSX = req.body.NSX
    const DONGIA = req.body.DONGIA
    const SL = req.body.SL
    try {
        const pool = await conn;
        await pool.request()
        .input('TENTHUOC', sql.NVarChar, TENTHUOC)
        .input('CONGDUNG', sql.NVarChar, CONGDUNG)
        .input('CHONGCHIDINH', sql.NVarChar, CHONGCHIDINH)
        .input('TACDUNGPHU', sql.NVarChar, TACDUNGPHU)
        .input('HDSD', sql.NVarChar, HDSD)
        .input('HSD', sql.Date, HSD)
        .input('NSX', sql.NVarChar, NSX)
        .input('DONGIA', sql.Int, DONGIA)
        .input('SL', sql.Int, SL)
        .execute('SP_POST_CREATE_THUOC');
        res.status(200).json({success: 'Thêm thuốc thành công'}); 
    } catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({error: err.message})
    } finally {
        sql.close();
    }
}

module.exports.updateThuoc_post = async (req, res) => {
    const MATHUOC = req.body.modalMATHUOC
    const TENTHUOC = req.body.modalTENTHUOC
    const CONGDUNG = req.body.modalCONGDUNG
    const CHONGCHIDINH = req.body.modalCHONGCHIDINH
    const TACDUNGPHU = req.body.modalTACDUNGPHU
    const HDSD = req.body.modalHDSD
    const HSD = req.body.modalHSD
    const NSX = req.body.modalNSX
    const DONGIA = req.body.modalDONGIA
    const SL = req.body.modalSL
    try {
        const pool = await conn;
        await pool.request()
        .input('MATHUOC', sql.Int, MATHUOC)
        .input('TENTHUOC', sql.NVarChar, TENTHUOC)
        .input('CONGDUNG', sql.NVarChar, CONGDUNG)
        .input('CHONGCHIDINH', sql.NVarChar, CHONGCHIDINH)
        .input('TACDUNGPHU', sql.NVarChar, TACDUNGPHU)
        .input('HDSD', sql.NVarChar, HDSD)
        .input('HSD', sql.Date, HSD)
        .input('NSX', sql.NVarChar, NSX)
        .input('DONGIA', sql.Int, DONGIA)
        .input('SL', sql.Int, SL)
        .execute('SP_POST_UPDATE_THUOC');
        res.status(200).json({success: 'Cập nhật thuốc thành công'}); 
    } catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({error: err.message})
    } finally {
        sql.close();
    }
}
