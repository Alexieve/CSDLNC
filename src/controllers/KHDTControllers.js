const {conn, sql} = require('../middleware/database')
const jwt = require('jsonwebtoken')

module.exports.getKHDT = async (req, res) => {
    res.render('ListKeHoachDieuTri');
}
module.exports.KHDT_get_data = async(req, res) => {
    const draw = req.query.draw || 1;
    const start = req.query.start || 0;
    const length = req.query.length || 10;
    // Lấy thông tin cột cần sort khi click
    if (typeof req.query.order === 'undefined') {
        var colName = 'MAKHDT';
        var colSortOrder = 'desc';
    }
    else {
        var colIndex = req.query.order[0].column;
        var colName = req.query.columns[colIndex].data;
        var colSortOrder = req.query.order[0].dir;
    }

    // Lấy các dữ liệu cho mỗi mục search theo cột
    const columns = req.query.columns.map(column => ({
        data: column.data,
        searchable: column.searchable,
        searchValue: column.search.value.toLowerCase(),
    }));

    // Lọc ra các dữ liệu search
    const filterConditions = columns
    .filter(column => column.searchable && column.searchValue !== '')
    .map(column => {
        if (column.data === 'MAKHDT' ||
        column.data === 'KHAMCHINH' || 
        column.data === 'TROKHAM')
        {            
            return `${column.data} = ${column.searchValue}`;
        } 
        else if (column.data === 'NGAYDIEUTRI') {
            const formattedSearchValue = column.searchValue.split('/').reverse().join('-');
            return `CONVERT(NVARCHAR, ${column.data}, 120) LIKE '%${formattedSearchValue}%'`;
        } 
        else {
            return `${column.data} LIKE N'%${column.searchValue}%'`;
        }
    });

    let MAKH = null;
    if (res.locals.user.LOAITK == 1) 
        MAKH = res.locals.user.ID;
    console.log(MAKH);
    // Tạo điều kiện cho câu truy vấn
    var filterQuery = MAKH ? `WHERE MAKH = ${MAKH} ` : 'WHERE 1 = 1 ';
    filterQuery += filterConditions.length > 0 ? `AND ${filterConditions.join(' AND ')}` : '';

    console.log(filterQuery);
    // Truy vấn
    try {
        const pool = await conn;
        const result = await pool.request()
        .input('FILTERQUERY', sql.NVarChar, filterQuery)
        .input('COLNAME', sql.NVarChar, colName)
        .input('COLSORTORDER', sql.NVarChar, colSortOrder)
        .input('OFFSET_START', sql.NVarChar, start)
        .input('LENGTH', sql.NVarChar, length)
        .input('MAKH',sql.VarChar, MAKH)
        .execute('SP_GET_DATATABLE_KHDIEUTRI')
    
        var recordsTotal = result.recordsets[0][0].recordsTotal;
        var recordsFiltered = result.recordsets[1][0].recordsTotal;
        var data = result.recordsets[2];
        // console.log(result.recordsets[1])
        console.log(data);
        res.json({
            draw: draw,
            recordsTotal: recordsTotal,
            recordsFiltered: recordsFiltered,
            data: data,
        });

    } catch (err) {
        console.error('SQL Server Error:', err.message);
        res.json({
            draw: draw,
            recordsTotal: 0,
            recordsFiltered: 0,
            data: {},
        });
    } finally {
        sql.close();
    }
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
    res.render('createKHDT-1', {listHSBN: JSON.stringify(result1), DieuTri: result2, NhaSi:JSON.stringify(result3)});
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
    console.log(req.body);
    let MANSKP = null;
    let GHICHU = null;
    const MAHSBN = req.body.MAHSBN;
    const MADIEUTRI = req.body.MADIEUTRI;
    const MOTAKH = req.body.MOTAKH;
    const NGAYDIEUTRI = req.body.NGAYDIEUTRI;
    const MANS = req.body.MANS;
    if (req.body.MANSKP != '') MANSKP = req.body.MANSKP;
    if (req.body.GHICHU != '') GHICHU = req.body.GHICHU;
    const RANG = req.body.RANG;
    const BEMATRANG = req.body.BEMATRANG;
    let MAKHDIEUTRI = null;
    try {
        const pool = await conn;
        const request = await pool.request();
        
        request.input('MAHSBN', sql.Int, MAHSBN);
        request.input('MADIEUTRI', sql.Int, MADIEUTRI);
        request.input('MOTAKH', sql.NVarChar, MOTAKH);
        request.input('NGAYDIEUTRI', sql.Date, NGAYDIEUTRI);
        request.input('KHAMCHINH', sql.Int, MANS);
        request.input('TROKHAM', sql.Int, MANSKP);
        request.input('GHICHU', sql.NVarChar, GHICHU);
        // Xác định parameter OUTPUT
        request.output('MAKHDIEUTRI', sql.Int); // Tên parameter OUTPUT và kiểu dữ liệu của nó
    
        const result = await request.execute('SP_CREATEKHDT');
        
        // Lấy giá trị OUTPUT từ parameter OUTPUT
        MAKHDIEUTRI = result.output.MAKHDIEUTRI;        
    } catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({ error: err.message });
    } finally {
        sql.close();
    }
    for (let i = 0; i < RANG.length; i++){
        try {
            const pool = await conn;
            await pool.request()
            .input('MAKHDIEUTRI', sql.Int, MAKHDIEUTRI)
            .input('MARANG', sql.Int, RANG[i])
            .input('MABEMATRANG', sql.Int, BEMATRANG[i])
            .execute('SP_CREATERANGDIEUTRI');
        } catch (err) {
            console.error('SQL Server Error:', err.message);
            res.status(400).json({error: err.message})
        } finally {
            sql.close();
        }
    }
    res.status(200).json({ message: 'Success', MAKHDIEUTRI: MAKHDIEUTRI });
}