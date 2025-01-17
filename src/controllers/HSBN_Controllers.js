const {conn, sql} = require('../middleware/database')

module.exports.HoSoBenhNhan_get = (req, res) => {
    res.render('listHSBN')
}

module.exports.HoSoBenhNhan_get_data = async (req, res) => {
    // Các dữ liệu output cho datatable
    const draw = req.query.draw || 1;
    const start = req.query.start || 0;
    const length = req.query.length || 10;

    // Lấy thông tin cột cần sort khi click
    if (typeof req.query.order === 'undefined') {
        var colName = 'MAHSBN';
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
        searchValue: column.search.value.toLowerCase()
    }));

    // Lọc ra các dữ liệu search
    const filterConditions = columns
    .filter(column => column.searchable && column.searchValue !== '')
    .map(column => {
        if (column.data === 'MAHSBN' ||
            column.data === 'TONGTIENDIEUTRI' || 
            column.data === 'DATHANHTOAN' ||
            column.data === 'SDTBN' ||
            column.data === 'GIOITINH') {     
            if (column.data === 'SDTBN') {
                return `${column.data} = '${column.searchValue}'`;
            } 
            if (column.data === 'GIOITINH') {
                return `${column.data} = N'${column.searchValue}'`;
            }      
            return `${column.data} = ${column.searchValue}`;
        } 
        else if (column.data === 'NGAYSINH') {
            const formattedSearchValue = column.searchValue.split('/').reverse().join('-');
            return `CONVERT(VARCHAR, ${column.data}, 120) LIKE '%${formattedSearchValue}%'`;
        } 
        else {
            return `${column.data} LIKE N'%${column.searchValue}%'`;
        }
    });

    let MAKH = null;
    if (res.locals.user.LOAITK == 1) 
        MAKH = res.locals.user.ID;

    // Tạo điều kiện cho câu truy vấn
    var filterQuery = MAKH ? `WHERE MAKH = ${MAKH} ` : 'WHERE 1 = 1 ';
    filterQuery += filterConditions.length > 0 ? `AND ${filterConditions.join(' AND ')}` : '';

    // Truy vấn
    try {
        console.log(filterQuery);
        const pool = await conn;
        const result = await pool.request()
        .input('FILTERQUERY', sql.NVarChar, filterQuery)
        .input('COLNAME', sql.NVarChar, colName)
        .input('COLSORTORDER', sql.NVarChar, colSortOrder)
        .input('OFFSET_START', sql.NVarChar, start)
        .input('LENGTH', sql.NVarChar, length)
        .execute('SP_GET_DATATABLE_HSBN')
    
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

module.exports.HoSoBenhNhan_post = async (req, res) => {
    // console.log(req.body);
    const MAHSBN = parseInt(req.body.MAHSBN)
    const HOTENBN = req.body.HOTENBN
    const NGAYSINH = req.body.NGAYSINH
    const GIOITINH = req.body.GIOITINH
    const SDTBN = req.body.SDTBN
    const DIACHIBN = req.body.DIACHIBN
    const TTSUCKHOE = req.body.TTSUCKHOE
    const TTDIUNG = req.body.TTDIUNG
    // console.log(MAHSBN, HOTENBN, NGAYSINH, GIOITINH, SDTBN, DIACHIBN, TTSUCKHOE, TTDIUNG)

    try {
        const pool = await conn;
        await pool.request()
        .input('MAHSBN', sql.Int, MAHSBN)
        .input('HOTENBN', sql.NVarChar, HOTENBN)
        .input('NGAYSINH', sql.VarChar, NGAYSINH)
        .input('GIOITINH', sql.NVarChar, GIOITINH)
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
        .input('GIOITINH', sql.NVarChar, GIOITINH)
        .input('SDTBN', sql.VarChar, SDTBN)
        .input('DIACHIBN', sql.NVarChar, DIACHIBN)
        .input('TTSUCKHOE', sql.NVarChar, TTSUCKHOE)
        .input('TTDIUNG', sql.NVarChar, TTDIUNG)
        .execute('SP_CREATE_HSBN');
        res.status(200).json({message: 'Success'}); 
    } catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({error: err.message})
    } finally {
        sql.close();
    }
}