const {conn, sql} = require('../middleware/database')
const jwt = require('jsonwebtoken')

module.exports.Thuoc_get = async (req, res) => {
    res.render('listThuoc');
}

module.exports.list_Thuoc_dataTable = async (req, res) => {
    var draw = req.query.draw;
    var start = req.query.start;
    var length = req.query.length;
    var order_data = req.query.order;
    if(typeof order_data == 'undefined') {
        var column_name = 'MATHUOC';
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
        if (column.data === 'MATHUOC' ||
            column.data === 'DONGIA' ||
            column.data === 'SL')
        {            
            return `${column.data} = ${column.searchValue}`;
        } 
        else if (column.data === 'HSD') {
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

    // console.log('SELECT * FROM THUOC ' + filterQuery +
    // ' ORDER BY ' + column_name + ' ' + column_sort_order +
    // ' OFFSET ' + start + ' ROWS FETCH NEXT ' + length + ' ROWS ONLY;')

    try {
        const pool = await conn;
        const result = await pool.request()
        .input('FILTERQUERY', sql.NVarChar, filterQuery)
        .input('COLNAME', sql.NVarChar, column_name)
        .input('COLSORTORDER', sql.NVarChar, column_sort_order)
        .input('OFFSET_START', sql.NVarChar, start)
        .input('LENGTH', sql.NVarChar, length)
        .execute('SP_GET_DATATABLE_THUOC');

        var recordsTotal = result.recordsets[0][0].recordsTotal;
        var recordsFiltered = result.recordsets[1][0].recordsTotal;
        var data = result.recordsets[2];
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
