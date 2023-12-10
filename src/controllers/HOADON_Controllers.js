const {conn, sql} = require('../middleware/database')
const jwt = require('jsonwebtoken')

module.exports.Hoadon_get = async (req, res) => {
    let result = null;
    try {
        const pool = await conn;
        result = (await pool.request().execute('SP_GET_LIST_HOADON')).recordset
    } catch (err) {
        console.error('SQL Server Error:', err.message);
    } finally {
        sql.close();
    }
    res.render('listHoadon', {Hoadon: result});
}

module.exports.list_Hoadon_dataTable = async (req, res) => {
    var draw = req.query.draw;
    var start = req.query.start;
    var length = req.query.length;
    var order_data = req.query.order;
    if(typeof order_data == 'undefined') {
        var column_name = 'MAHOADON';
        var column_sort_order = 'asc';
    }
    else {
        var column_index = req.query.order[0]['column'];
        var column_name = req.query.columns[column_index]['data'];
        var column_sort_order = req.query.order[0]['dir'];
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
        if (column.data === 'MAHOADON' ||
            column.data === 'MAKH' ||
            column.data === 'TONGTIENCANTT' ||
            column.data === 'SOTIENNHAN' ||
            column.data === 'SOTIENTHOI' ||
            column.data === 'NVTHANHTOAN')
        {            
            return `${column.data} = ${column.searchValue}`;
        } 
        else if (column.data === 'NGAYTT') {
            const formattedSearchValue = column.searchValue.split('/').reverse().join('-');
            return `CONVERT(NVARCHAR, ${column.data}, 120) LIKE '%${formattedSearchValue}%'`;
        } 
        else {
            return `${column.data} LIKE N'%${column.searchValue}%'`;
        }
    });

    // Tạo điều kiện cho câu truy vấn
    var filterQuery = 'WHERE 1 = 1 ';
    filterQuery += filterConditions.length > 0 ? `AND ${filterConditions.join(' AND ')}` : '';

    console.log('SELECT * FROM THUOC ' + filterQuery +
    ' ORDER BY ' + column_name + ' ' + column_sort_order +
    ' OFFSET ' + start + ' ROWS FETCH NEXT ' + length + ' ROWS ONLY;')

    try {
        const pool = await conn;
        const result = await pool.request()
        .input('FILTERQUERY', sql.NVarChar, filterQuery)
        .input('COLNAME', sql.NVarChar, column_name)
        .input('COLSORTORDER', sql.NVarChar, column_sort_order)
        .input('OFFSET_START', sql.NVarChar, start)
        .input('LENGTH', sql.NVarChar, length)
        .execute('SP_GET_DATATABLE_HOADON');

        var recordsTotal = result.recordsets[0][0].recordsTotal;
        var recordsFiltered = result.recordsets[1][0].recordsTotal;
        var data = result.recordsets[2];
        // console.log(data)
        res.status(200).json({
            draw: draw,
            recordsTotal: recordsTotal,
            recordsFiltered: recordsFiltered,
            data: data,
        }); 

    } catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({
            draw: draw,
            recordsTotal: 0,
            recordsFiltered: 0,
            data: {},
        });
    } finally {
        sql.close();
    }

}

module.exports.createHoadon_get = async (req, res) => {
    let result = null;
    try {
        const pool = await conn;
        result = (await pool.request().execute('SP_GET_LIST_KH')).recordset
    } catch (err) {
        console.error('SQL Server Error:', err.message);
    } finally {
        sql.close();
    }
    res.render('createHoadon', {listKH: JSON.stringify(result), NVTHANHTOAN: res.locals.user.ID});
}

module.exports.createHoadon_post = async (req, res) => {
    let MAKH = null
    let NGAYTT = new Date(req.body.NGAYTT)
    let NGUOITT = req.body.NGUOITT
    // let TONGTIENCANTT = parseInt(req.body.TONGTIENCANTT)
    let SOTIENNHAN = parseInt(req.body.SOTIENNHAN)
    // let SOTIENTHOI = parseInt(req.body.SOTIENTHOI)
    let LOAITT = req.body.LOAITT
    if (LOAITT == 'Chuyển khoản' || LOAITT == 'Ví điện tử')
        MAKH = parseInt(req.body.MAKH)
    let NVTHANHTOAN = parseInt(req.body.NVTHANHTOAN)
    let MAKHDIEUTRI = req.body.MAKHDIEUTRI.split(',')
    // console.log(MAKH, NGAYTT, NGUOITT, TONGTIENCANTT, SOTIENNHAN, SOTIENTHOI, LOAITT, NVTHANHTOAN, MAKHDIEUTRI)
    try {
        const pool = await conn;
        let MAHDTT = null;
        const table = new sql.Table();
        table.columns.add('MAKHDT', sql.Int);
        for(var i=0; i < MAKHDIEUTRI.length; i++) {
            table.rows.add(parseInt(MAKHDIEUTRI[i]));
        }
        const result = await pool.request()
        .input('MAKH', sql.Int, MAKH)
        .input('NGAYTT', sql.Date, NGAYTT)
        .input('NGUOITT', sql.NVarChar, NGUOITT)
        .input('SOTIENNHAN', sql.Int, SOTIENNHAN)
        .input('LOAITT', sql.NVarChar, LOAITT)
        .input('NVTHANHTOAN', sql.Int, NVTHANHTOAN)
        .input('LIST_MAKHDT', table)
        .output('MAHDTT', sql.Int, MAHDTT)
        .execute('SP_POST_CREATE_HOADON');
        MAHDTT = result.output.MAHDTT
        for(var i=0; i < MAKHDIEUTRI.length; i++) {
            await pool.request()
            .input('MAKHDIEUTRI', sql.Int, parseInt(MAKHDIEUTRI[i]))
            .input('MAHDTT', sql.Int, MAHDTT)
            .execute('SP_UPDATE_KHDT');
        }
        res.status(200).json({success: 'Tạo hóa đơn thành công'}); 
    } catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({error: err.message})
    } finally {
        sql.close();
    }
}

module.exports.khdt_get = async (req, res) => {
    let result = null;
    let MAKH = req.query.value;
    try {
        const pool = await conn;
        if (MAKH != -1)
            result = (await pool.request().input('MAKH', sql.Int, MAKH).execute('SP_GET_LIST_KHDIEUTRI_THEO_MAKH')).recordset
        else
            result = (await pool.request().execute('SP_GET_LIST_KHDIEUTRI')).recordset
    } catch (err) {
        console.error('SQL Server Error:', err.message);
    } finally {
        sql.close();
    }
    res.json(result)
}