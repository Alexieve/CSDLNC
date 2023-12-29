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
        column.data === 'SDTBN')
        {            
            return `${column.data} = ${column.searchValue}`;
        } 
        else if (column.data === 'XACNHAN') {
            const tmp = column.searchValue;
            if ( tmp == '2')
            return `${column.data} = 1 AND NGAYHEN < GETDATE()`;
            else if (tmp == '1')
            return `${column.data} = 1 AND NGAYHEN >= GETDATE()`;  
            else
            return `${column.data} = ${column.searchValue}`;
        } 
        else if (column.data === 'MATAIKHAM') {
            const tmp = column.searchValue;
            if ( tmp == '1')
            return `${column.data} IS NULL`;
            else if (tmp == '0')
            return `${column.data} IS NOT NULL`;  
            else
            return `${column.data} = ${column.searchValue}`;
        } 
        else if (column.data === 'NGAYHEN') {
            // const formattedSearchValue = column.searchValue.split('/').reverse().join('-');
            // return `CONVERT(NVARCHAR, ${column.data}, 120) LIKE '%${formattedSearchValue}%'`;
            const parts = column.searchValue.split('/');
            const formattedSearchValue = `'${parts[2]}-${parts[1]}-${parts[0]}'`;
            return `${column.data} = ${formattedSearchValue}`
        } 
        else if (column.data === 'GIOHEN') {
            const formattedSearchValue2 = column.searchValue;
            return `CONVERT(NVARCHAR, ${column.data}, 120) LIKE '%${formattedSearchValue2}%'`;
        }
        else {
            return `${column.data} LIKE N'%${column.searchValue}%'`;
        }
    });

    let MAKH = null;
    var filterQuery = null;
    let khachhangcheck = null;
    if (res.locals.user.LOAITK == 1) 
        {
            MAKH = res.locals.user.ID;
            khachhangcheck = res.locals.user.ID;
            filterQuery = '';
            
        }
    else if (res.locals.user.LOAITK == 2) 
        {
            MAKH = res.locals.user.ID;
            filterQuery = MAKH ? `WHERE MANS = ${MAKH} ` : 'WHERE 1 = 1 ';
            khachhangcheck = 0;
        }
    else 
        {
            filterQuery = 'WHERE 1 = 1 ';
            khachhangcheck = 0;
        }    
    // Tạo điều kiện cho câu truy vấn
    // var filterQuery = MAKH ? `WHERE MAHSBN = ${MAKH} ` : 'WHERE 1 = 1 ';
    filterQuery += filterConditions.length > 0 ? `AND ${filterConditions.join(' AND ')}` : '';
    console.log(filterQuery);
    
    // var filterQuery2 = 'WHERE 1 =1';
    // filterQuery2 += filterConditions.length > 0 ? `AND LH.${filterConditions.join(' AND LH.')}` : '';
    // Truy vấn
    try {
        const pool = await conn;
        const result = await pool.request()
        .input('FILTERQUERY', sql.NVarChar, filterQuery)
        .input('COLNAME', sql.NVarChar, colName)
        .input('COLSORTORDER', sql.NVarChar, colSortOrder)
        .input('OFFSET_START', sql.NVarChar, start)
        .input('LENGTH', sql.NVarChar, length)
        .input('KHACHHANGCHECK', sql.Int, khachhangcheck)
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

module.exports.updateLH_get = async (req, res) => {
    const malh = req.query.malh;
    const mans = req.query.mans;
    const mahsbn = req.query.mahsbn;

    // Sử dụng giá trị theo nhu cầu
    console.log('MALH:', malh);
    console.log('MANS:', mans);
    console.log('MAHSBN:', mahsbn);

    // Thực hiện các xử lý khác tại đây

    // Render view hoặc gửi dữ liệu trả về theo nhu cầu
    res.render('updateLH', { malh, mans, mahsbn });
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

module.exports.updateLH_post = async (req, res) => {
    //  console.log(req.body);
    //  console.log(req.body.MALH);
   
    let MANS = null
    let HOTENNS = null
    if (req.body.MANS != '') {
        MANS = JSON.parse(req.body.MANS).MANS
        HOTENNS = req.body.HOTENNS
    }
    const MALH = req.body.MALH;
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
        .input('MALH', sql.Int, MALH)
        .input('MACN', sql.Int, MACN)
        .input('MANS', sql.Int, MANS)
        .input('MAHSBN', sql.Int, MAHSBN)
        .input('HOTENBN', sql.NVarChar, HOTENBN)
        .input('SDTBN', sql.NVarChar, SDTBN)
        .input('HOTENNS', sql.NVarChar, HOTENNS)
        .input('NGAYHEN', sql.Date, NGAYHEN)
        .input('GIOHENSTR', sql.VarChar, GIOHEN)
        .execute('SP_UPDATE_APPOINMENT');
        res.status(200).json({message: 'Success'}); 
    } catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({error: err.message})
    } finally {
        sql.close();
    }
}
