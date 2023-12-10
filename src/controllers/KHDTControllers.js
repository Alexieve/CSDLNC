const {conn, sql} = require('../middleware/database')
const jwt = require('jsonwebtoken')

module.exports.getKHDT = async (req, res) => {
    res.render('ListKeHoachDieuTri');
}
module.exports.getAddDonThuoc = async (req, res) => {
    const MAKHDIEUTRI = req.query.MAKHDIEUTRI;
    //console.log(MAKHDIEUTRI);
    res.render('addDonThuoc',{MAKHDIEUTRI});
}
module.exports.addDonThuoc = async (req, res) => {
    const MAKHDIEUTRI = req.body.MAKHDIEUTRI;
    console.log(req.body);
    const table = new sql.Table();
    table.columns.add('MATHUOC', sql.Int);
    const SOLUONG = req.body.SOLUONG;
    const GHICHU = req.body.GHICHU;
    for(let i=0; i < SOLUONG.length; i++) {
        table.rows.add(JSON.parse(req.body.MATHUOC[i]).MATHUOC);
    }
    console.log(SOLUONG);
    console.log(GHICHU);
    try {
        const pool = await conn;
        await pool.request()
        .input('MAKHDIEUTRI', sql.Int, MAKHDIEUTRI)
        .input('GHICHU', sql.NVarChar, GHICHU)
        .execute('SP_ADD_DON_THUOC'); 
    } catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({error: err.message})
    } finally {
        sql.close();
    }  
    for (let i = 0; i < SOLUONG.length; i++){
        const MATHUOC = JSON.parse(req.body.MATHUOC[i]).MATHUOC;
        try {
            const pool = await conn;
            await pool.request()
            .input('MAKHDIEUTRI', sql.Int, MAKHDIEUTRI)
            .input('MATHUOC', sql.Int, MATHUOC)
            .input('SOLUONG', sql.Int, SOLUONG[i])
            .execute('SP_ADD_CHI_TIET_DON_THUOC');
        } catch (err) {
            console.error('SQL Server Error:', err.message);
            res.status(400).json({error: err.message})
        } finally {
            sql.close();
        }
        console.log("OK");
    }
    res.status(200).json({ message: 'Success', MAKHDIEUTRI: MAKHDIEUTRI }).redirect('/khdt');   
}
module.exports.UpDateTrangThai = async(req,res) =>{
    const trangThai = req.body.TRANGTHAI;
    const MAKHDIEUTRI = req.body.MAKHDIEUTRI;
    console.log(trangThai);
    console.log(MAKHDIEUTRI);

    try {
        const pool = await conn;
        await pool.request()
        .input('MAKHDIEUTRI', sql.Int, MAKHDIEUTRI)
        .input('TRANGTHAI', sql.Int, trangThai)
        .execute('SP_UPDATETRANGTHAI');
        res.status(200).redirect('/khdt');  
    } catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({error: err.message})
    } finally {
        sql.close();
    }
}
module.exports.KHDT_get_data = async(req, res) => {
    const draw = req.query.draw || 1;
    const start = req.query.start || 0;
    const length = req.query.length || 10;
    // Lấy thông tin cột cần sort khi click
    if (typeof req.query.order === 'undefined') {
        var colName = 'MAKHDIEUTRI';
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
        if (column.data === 'MAKHDIEUTRI' ||
        column.data === 'KHAMCHINH' || 
        column.data === 'TROKHAM' || column.data ==="MAHSBN")
        {            
            return `KHDT.${column.data} = ${column.searchValue}`;
        } 
        else if (column.data === 'NGAYDIEUTRI') {
            const formattedSearchValue = column.searchValue.split('/').reverse().join('-');
            return `KHDT.CONVERT(NVARCHAR, ${column.data}, 120) LIKE '%${formattedSearchValue}%'`;
        } 
        else {
            return `KHDT.${column.data} LIKE N'%${column.searchValue}%'`;
        }
    });

    let MAKH = null;
    if (res.locals.user.LOAITK == 1) 
        MAKH = res.locals.user.ID;
    // Tạo điều kiện cho câu truy vấn
    var filterQuery = MAKH ? `WHERE HSBN.MAKH = ${MAKH} ` : 'WHERE 1 = 1 ';
    filterQuery += filterConditions.length > 0 ? `AND ${filterConditions.join(' AND ')}` : '';
    //console.log(filterQuery);
    // Truy vấn
    try {
        const pool = await conn;
        const result = await pool.request()
        .input('FILTERQUERY', sql.NVarChar, filterQuery)
        .input('COLNAME', sql.NVarChar, colName)
        .input('COLSORTORDER', sql.NVarChar, colSortOrder)
        .input('OFFSET_START', sql.NVarChar, start)
        .input('LENGTH', sql.NVarChar, length)
        .input('MAKH',sql.Int, MAKH)
        .execute('SP_GET_DATATABLE_KHDIEUTRI')
    
        var recordsTotal = result.recordsets[0][0].recordsTotal;
        var recordsFiltered = result.recordsets[1][0].recordsTotal;
        var data = result.recordsets[2];
       // console.log(result.recordsets[data])
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
module.exports.createKHDT1_get = async (req, res) => {
    let result2 = null;
    try {
        const pool = await conn;
        result2 = (await pool.request()
        .execute('SP_GETDIEUTRI')).recordset;
    } catch (err) {
        console.error('SQL Server Error:', err.message);
    } finally {
        sql.close();
    }
    res.render('createKHDT-1', {DieuTri: result2});
}
module.exports.createKHDT_post = async (req, res) => {
    console.log(req.body);
    let MANSKP = null;
    let GHICHU = null;
    let TENNSTROKHAM = null;
    const HOTENBN = JSON.parse(req.body.MAHSBN).HOTENBN;
    const MAHSBN = JSON.parse(req.body.MAHSBN).MAHSBN;
    const MADIEUTRI = req.body.MADIEUTRI;
    const MOTAKH = req.body.MOTAKH;
    const NGAYDIEUTRI = req.body.NGAYDIEUTRI;
    const MANS = JSON.parse(req.body.MANS).MANS;
    const TENNSKHAMCHINH = JSON.parse(req.body.MANS).HOTEN;
    if (req.body.MANSKP != ''){
        MANSKP = JSON.parse(req.body.MANSKP).MANS;
        TENNSTROKHAM = JSON.parse(req.body.MANSKP).HOTEN;
    }
    if (req.body.GHICHU != '') GHICHU = req.body.GHICHU;

    const RANG = req.body.RANG;
    const BEMATRANG = req.body.BEMATRANG;
    let MAKHDIEUTRI = null;
    try {
        const pool = await conn;
        const request = await pool.request();
        
        request.input('MAHSBN', sql.Int, MAHSBN);
        request.input('HOTENBN',sql.NVarChar,HOTENBN);
        request.input('MADIEUTRI', sql.Int, MADIEUTRI);
        request.input('MOTAKH', sql.NVarChar, MOTAKH);
        request.input('NGAYDIEUTRI', sql.Date, NGAYDIEUTRI);
        request.input('KHAMCHINH', sql.Int, MANS);
        request.input('TENNSKHAMCHINH', sql.NVarChar, TENNSKHAMCHINH);
        request.input('TROKHAM', sql.Int, MANSKP);
        request.input('TENNSTROKHAM', sql.NVarChar, TENNSTROKHAM);
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
module.exports.search_dentists_get = async (req, res) => {
    const keyword = req.query.keyword.toLowerCase();
    try {
        const pool = await conn;
        const result = (await pool.request()
        .input('KEYWORD', sql.NVarChar, keyword)
        .execute('SP_SEARCH_DENTISTS_KEYWORD')).recordset
        res.status(200).json(result); 
    } catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({error: err.message})
    } finally {
        sql.close();
    }
}

module.exports.search_thuoc_get = async (req, res) => {
    const keyword = req.query.keyword.toLowerCase();
    try {
        const pool = await conn;
        const result = (await pool.request()
        .input('KEYWORD', sql.NVarChar, keyword)
        .execute('SP_SEARCH_THUOC_KEYWORD')).recordset
        res.status(200).json(result); 
    } catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({error: err.message})
    } finally {
        sql.close();
    }
}