const { conn, sql } = require('../middleware/database')
const jwt = require('jsonwebtoken')

module.exports.Nhansu_Nhasi_get = async (req, res) => {
    res.render('listNhasi');
}
module.exports.listNS_get_data = async (req, res) => {
    // Các dữ liệu output cho datatable
    const draw = req.query.draw || 1;
    const start = req.query.start || 0;
    const length = req.query.length || 10;
    // Lấy thông tin cột cần sort khi click
    if (typeof req.query.order === 'undefined') {
        var colName = 'MANS';
        var colSortOrder = 'desc';
    } else {
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
            if (column.data === 'MANS' ||
                column.data === 'GIOITINH') {
                return `${column.data} = ${column.searchValue}`;
            } else if (column.data === 'NGAYSINH') {
                const formattedSearchValue = column.searchValue.split('/').reverse().join('-');
                return `CONVERT(VARCHAR, ${column.data}, 120) LIKE '%${formattedSearchValue}%'`;
            } else {
                return `${column.data} LIKE N'%${column.searchValue}%'`;
            }
        });
    // Tạo điều kiện cho câu truy vấn
    var filterQuery = filterConditions.length > 0 ? `WHERE ${filterConditions.join(' AND ')}` : '';
    // Truy vấn
    try {
        const pool = await conn;
        const result = await pool.request()
            .input('FILTERQUERY', sql.NVarChar, filterQuery)
            .input('COLNAME', sql.NVarChar, colName)
            .input('COLSORTORDER', sql.NVarChar, colSortOrder)
            .input('OFFSET_START', sql.NVarChar, start)
            .input('LENGTH', sql.NVarChar, length)
            .execute('SP_GET_DATATABLE_NS');
        var recordsTotal = result.recordsets[0][0].recordsTotal;
        var recordsFiltered = result.recordsets[1][0].recordsTotal;
        var data = result.recordsets[2];
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

//update
module.exports.Nhansu_Nhasi_post = async (req, res) => {
    //console.log(req.body);
    const MANS = parseInt(req.body.MANS);
    const HOTEN = req.body.HOTEN;
    const NGAYSINH = req.body.NGAYSINH;
    const GIOITINH = req.body.GIOITINH;
    const DIACHI = req.body.DIACHI;

    try {
        const pool = await conn;
        await pool.request()
            .input('MANS', sql.Int, MANS)
            .input('HOTEN', sql.NVarChar, HOTEN)
            .input('NGAYSINH', sql.Date, NGAYSINH)
            .input('GIOITINH', sql.NVarChar, GIOITINH)
            .input('DIACHI', sql.NVarChar, DIACHI)
            .execute('SP_UPDATE_NHASI');
        res.status(200).redirect('/listNS');
    } catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({ error: err.message });
    } finally {
        sql.close();
    }
}

module.exports.createNS_get = (req, res) => {
    res.render('createNS');
}

module.exports.createNS_post = async (req, res) => {
    const HOTEN = req.body.HOTEN;
    const NGAYSINH = req.body.NGAYSINH;
    const GIOITINH = req.body.GIOITINH;
    const SDT = req.body.SDT;
    const DIACHI = req.body.DIACHI;
    const EMAIL = req.body.EMAIL;
    const MACN = req.body.MACN;
    const MATKHAU =  req.body.MATKHAU;
    try {
        const pool = await conn;
        await pool.request()
            .input('HOTEN', sql.NVarChar, HOTEN)
            .input('NGAYSINH', sql.VarChar, NGAYSINH)
            .input('GIOITINH', sql.VarChar, GIOITINH)
            .input('SDT', sql.VarChar, SDT)
            .input('DIACHI', sql.NVarChar, DIACHI)
            .input('EMAIL', sql.NVarChar, EMAIL)
            .input('MACN', sql.Int, MACN)
            .input('MATKHAU', sql.NVarChar, MATKHAU)
            .execute('SP_CREATE_NS');
        res.status(200).json({ message: 'Thêm nha sĩ thành công' });
    } catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({ error: err.message });
    } finally {
        sql.close();
    }
}