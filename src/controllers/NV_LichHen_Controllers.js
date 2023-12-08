const {conn, sql} = require('../middleware/database')
const jwt = require('jsonwebtoken')

module.exports.LichHen_get = async (req, res) => {
        res.render('Appointment_manage');
   
}
module.exports.LichHen_get_data = async (req, res) => {
    const draw = req.query.draw || 1;
    const start = req.query.start || 0;
    const length = req.query.length || 10;

    // Lấy thông tin cột cần sort khi click
    if (typeof req.query.order === 'undefined') {
        var colName = 'MALH';
        var colSortOrder = 'desc';
    }
    else {
        var colIndex = req.query.order[0].column;
        var colName = req.query.columns[colIndex].data;
        var colSortOrder = req.query.order[0].dir;
        // console.log(colSortOrder);
        // console.log(colName);
        // console.log(colIndex);
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
        if (column.data === 'MALH' ||
        column.data === 'MANS' || 
        column.data === 'MAHSBN' ||
        column.data === 'XACNHAN' ||
        column.data === 'TAIKHAM' ||
        column.data === 'SDTBN')
        {            
            return `${column.data} = ${column.searchValue}`;
        } 
        else if (column.data === 'NGAYHEN') {
            const formattedSearchValue = column.searchValue.split('/').reverse().join('-');
            return `CONVERT(NVARCHAR, ${column.data}, 120) LIKE '%${formattedSearchValue}%'`;
        } 
        else if (column.data === 'GIOHEN') {
            const formattedSearchValue2 = column.searchValue;
            return `CONVERT(NVARCHAR, ${column.data}, 120) LIKE '%${formattedSearchValue2}%'`;
        }
        else {
            return `${column.data} LIKE N'%${column.searchValue}%'`;
        }
    });

     let MALH = null;
    // if (res.locals.user.LOAITK == 1) 
    //     MALH = res.locals.user.ID;

    // Tạo điều kiện cho câu truy vấn
    var filterQuery = MALH ? `WHERE MAKH = ${MALH} ` : 'WHERE 1 = 1 ';
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
        .execute('SP_GET_DATATABLE_LICHHEN')

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

module.exports.LichHen_post = async (req, res) => {
    //console.log(req.body);
    const MaLH = req.body.malh;
    console.log(MaLH);
    try {
        const pool = await conn;
        const result = await pool.request()
        .input('MaLH', sql.Int, MaLH)
        .execute('SP_POST_ACCEPT_LICHHEN');
        if (result.returnValue === 0) {
            res.send('done');
        }
    } catch (err) {
        console.error('SQL Server Error:', err.message);
        res.send('fail');
    } finally {
        sql.close();
    }
}
module.exports.LichHen_post2 = async (req, res) => {
    console.log(req.body);
    const MaLH = req.body.malh;
    console.log(MaLH);
    try {
        const pool = await conn;
        const result = await pool.request()
        .input('MaLH', sql.Int, MaLH)
        .execute('SP_POST_DENY_LICHHEN');
        if (result.returnValue === 0) {
            res.send('done');
        } 
    } catch (err) {
        console.error('SQL Server Error:', err.message);
        res.send('fail');
    } finally {
        sql.close();
    }
}

