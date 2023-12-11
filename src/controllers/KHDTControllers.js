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
    const table = new sql.Table();
    table.columns.add('MATHUOC', sql.Int);
    table.columns.add('SOLUONG', sql.Int);
    const SOLUONG = req.body.SOLUONG;
    const GHICHU = req.body.GHICHU;
    const mathuocSoluongArray = [];
    const mathuocSoluongMap = {};
    for (let i = 0; i < SOLUONG.length; i++) {
        const mathuoc = JSON.parse(req.body.MATHUOC[i]).MATHUOC;
        const soluong = parseInt(SOLUONG[i]);
    
        // Nếu MATHUOC đã tồn tại trong đối tượng mathuocSoluongMap, thì cộng dồn số lượng
        if (mathuocSoluongMap[mathuoc]) {
            mathuocSoluongMap[mathuoc] += soluong;
        } else {
            // Nếu chưa tồn tại, thêm mới vào đối tượng mathuocSoluongMap
            mathuocSoluongMap[mathuoc] = soluong;
        }
    }
    
    // Chuyển đổi đối tượng thành mảng 2 chiều nếu cần
    for (const mathuoc in mathuocSoluongMap) {
        mathuocSoluongArray.push([mathuoc, mathuocSoluongMap[mathuoc]]);
        table.rows.add(parseInt(mathuoc),mathuocSoluongMap[mathuoc]);
    }
    
    try {
        const pool = await conn;
        await pool.request()
        .input('MAKHDIEUTRI', sql.Int, MAKHDIEUTRI)
        .input('GHICHU', sql.NVarChar, GHICHU)
        .input('MANGTHUOC',table)
        .execute('SP_ADD_CHI_TIET_DON_THUOC'); 
        res.status(200).json(table); 
    } catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({error: err.message})
    } finally {        
        sql.close();
    }  
}
module.exports.UpDateTrangThai = async(req,res) =>{
    const trangThai = req.body.TRANGTHAI;
    const MAKHDIEUTRI = req.body.MAKHDIEUTRI;

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
        else if (column.data === 'TRANGTHAI'){
            if (column.searchValue == "đang điều trị" || column.searchValue == 1 ) return `KHDT.${column.data} = 1`;
            else if (column.searchValue == "đã hoàn thành" || column.searchValue == 2 ) return `KHDT.${column.data} = 2`;
            else if (column.searchValue == "đã hủy" || column.searchValue == 3) return `KHDT.${column.data} = 3`;
            return `KHDT.${column.data} LIKE N'%${column.searchValue}%'`;
        }
        else if (column.data === 'TRANGTHAI_TIEN'){
            if (column.searchValue == "đã trả tiền") return `KHDT.MAHDTT IS NOT NULL`;
            else if (column.searchValue == "chưa trả tiền") return `KHDT.MAHDTT IS NULL`;
            else return `KHDT.${column.data} LIKE N'%${column.searchValue}%'`;
        }
        else {
            return `KHDT.${column.data} LIKE N'%${column.searchValue}%'`;
        }
    });

    let MAKH = null;
    let MANS = null;
    var filterQuery;
    if (res.locals.user.LOAITK == 1){
        MAKH = res.locals.user.ID;
    }
    if (res.locals.user.LOAITK == 2){
        MANS = res.locals.user.ID;
    }
    if (MAKH != null) filterQuery = `WHERE HSBN.MAKH = ${MAKH} `;
    else if (MANS != null) filterQuery = `WHERE KHDT.KHAMCHINH = ${MANS} OR KHDT.TROKHAM = ${MANS} `
    else filterQuery = 'WHERE 1 = 1 '
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
    const pairs = [];
    let hasDuplicates = false;
    let duplicatePair = '';
    for (let i = 0; i < RANG.length; i++) {
        const pair = `${RANG[i]}-${BEMATRANG[i]}`; // Tạo chuỗi đại diện cho cặp
    
        // Kiểm tra nếu cặp này đã xuất hiện trong mảng pairs
        if (pairs.includes(pair)) {
            hasDuplicates = true;
            duplicatePair = pair;
            break; // Nếu có cặp trùng lặp, dừng vòng lặp
        } else {
            pairs.push(pair); // Nếu không trùng lặp, thêm cặp vào mảng pairs
        }
    }
    if (hasDuplicates) {
        return res.status(400).json({ error: `Có cặp răng bị trùng lập` });
    }  
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
    res.status(200).json({ message: 'Tạo kế hoạch điều trị thành công', MAKHDIEUTRI: MAKHDIEUTRI });
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