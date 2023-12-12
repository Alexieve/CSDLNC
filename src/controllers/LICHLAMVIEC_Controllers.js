const {conn, sql} = require('../middleware/database')

module.exports.xem_lichlamviec_get = async (req, res) => {
    res.render('lichlamviec');
}

module.exports.search_nhasi_get = async (req, res) => {
    const keyword = req.query.keyword.toLowerCase();
    try {
        const pool = await conn;
        const result = (await pool.request()
        .input('KEYWORD', sql.NVarChar, keyword)
        .execute('SP_SEARCH_NHASI_LLV')).recordset
        res.status(200).json(result); 
    } catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({error: err.message})
    } finally {
        sql.close();
    }
}

module.exports.changeMode_lichlamviec_get = async (req, res) => {
    const mans = req.params.mans;
    const dimensions = [7,24];
    const dayList = [
        {name:"Thứ Hai"}, {name:"Thứ Ba"}, {name:"Thứ Tư"}, {name:"Thứ Năm"}, {name:"Thứ Sáu"}, {name:"Thứ Bảy"}, {name:"Chủ Nhật"},
    ];
    const sheetData = Array.from({ length: 7 }, () => Array(24).fill(0));
    if (mans == 0) {
        res.status(200).json({
            dimensions: dimensions,
            dayList: dayList,
            sheetData: sheetData,
        }); 
        return;
    }

    try {
        const pool = await conn;
        const result = (await pool.request()
        .input('MANS', sql.Int, mans)
        .execute('SP_GET_LLV_NHASI')).recordset

        result.forEach(({ NGAYLAM, BATDAU, KETTHUC }) => {
            for (let hour = 0; hour < 24; hour++) {
                if (hour >= BATDAU - 1 && hour <= KETTHUC - 1) {
                    sheetData[(NGAYLAM + 5) % 7][hour + 1] = 1; // Adjust the index
                }
            }
        });
        res.status(200).json({
            dimensions: dimensions,
            dayList: dayList,
            sheetData: sheetData,
        }); 
    }
    catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({error: err.message})
    } finally {
        sql.close();
    }
}

module.exports.weeklyMode_lichlamviec_get = async (req, res) => {
    const mans = req.params.mans;
    const week = parseInt(req.query.week);
    const year = parseInt(req.query.year);
    const dimensions = [7,24];
    const sheetData = Array.from({ length: 7 }, () => Array(24).fill(0));

    // console.log(new Date());
    var firstDay = new Date(year, 0, (1 + (week - 1) * 7));
    firstDay.setDate(firstDay.getDate() + (1 - firstDay.getDay()));
    // console.log(firstDay);
    var dayList = [];
    for (var i = 0; i < 7; i++) {
        var currentDate = new Date(firstDay.getTime() + i * 24 * 60 * 60 * 1000);
        dayList.push({name: currentDate.toLocaleDateString()});
    }

    var startDate = new Date(firstDay.getTime() + 24 * 60 * 60 * 1000);
    var endDate = new Date(firstDay.getTime() + 7 * 24 * 60 * 60 * 1000);
    // console.log(startDate, endDate);

    // format daylist to dd/mm/yyyy
    dayList = dayList.map((day) => {
        var date = new Date(day.name);
        return {name: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`};
    });

    if (mans == 0) {
        res.status(200).json({
            dimensions: dimensions,
            dayList: dayList,
            sheetData: sheetData,
        }); 
        return;
    }

    try {
        const pool = await conn;
        const result = (await pool.request()
        .input('MANS', sql.Int, mans)
        .input('STARTDATE', sql.Date, startDate)
        .input('ENDDATE', sql.Date, endDate)
        .execute('SP_GET_LLV_WEEKLY')).recordset

        result.forEach(({ NGAYLAM, BATDAU, KETTHUC }) => {
            for (let hour = 0; hour < 24; hour++) {
                if (hour >= BATDAU - 1 && hour <= KETTHUC - 1) {
                    sheetData[(NGAYLAM + 5) % 7][hour + 1] = 1; // Adjust the index
                }
            }
        });

        res.status(200).json({
            dimensions: dimensions,
            dayList: dayList,
            sheetData: sheetData,
        }); 
    }
    catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({error: err.message})
    } finally {
        sql.close();
    }
}


module.exports.monthlyMode_lichlamviec_get = async (req, res) => {
    const mans = req.params.mans;
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);

    const daysInMonth = new Date(year, month, 0).getDate();
    var dayList = [];
    for (let i = 1; i <= daysInMonth; i++) {
        const currentDate = new Date(year, month - 1, i);
        dayList.push({ name: currentDate.toLocaleDateString() });
    }

    var startDate = new Date(year, month - 1, 2)
    var endDate = new Date(year, month - 1, daysInMonth + 1)
    
    // format daylist to dd/mm/yyyy
    dayList = dayList.map((day) => {
        var date = new Date(day.name);
        return {name: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`};
    });

    const dimensions = [daysInMonth,24];
    const sheetData = Array.from({ length: daysInMonth }, () => Array(24).fill(0));

    if (mans == 0) {
        res.status(200).json({
            dimensions: dimensions,
            dayList: dayList,
            sheetData: sheetData,
        }); 
        return;
    }

    try {
        const pool = await conn;
        const result = (await pool.request()
        .input('MANS', sql.Int, mans)
        .input('STARTDATE', sql.Date, startDate)
        .input('ENDDATE', sql.Date, endDate)
        .execute('SP_GET_LLV_MONTHLY')).recordset

        result.forEach(({ NGAYLAM, BATDAU, KETTHUC }) => {
            for (let hour = 0; hour < 24; hour++) {
                if (hour >= BATDAU - 1 && hour <= KETTHUC - 1) {
                    sheetData[NGAYLAM - 1][hour + 1] = 1; 
                }
            }
        });
        res.status(200).json({
            dimensions: dimensions,
            dayList: dayList,
            sheetData: sheetData,
        }); 
    }
    catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({error: err.message})
    } finally {
        sql.close();
    }
}

module.exports.update_lichlamviec_post = async (req, res) => {
    const mans = req.params.mans;
    const dimensions = [7,24];
    const sheetData = req.body.sheetData;

    const table = new sql.Table();
    table.columns.add('MANS', sql.Int);
    table.columns.add('NGAYLAM', sql.Int);
    table.columns.add('GIOBATDAU', sql.VarChar);
    table.columns.add('GIOKETTHUC', sql.VarChar);

    sheetData.map((row, dayIndex) => {
        let NGAYLAM = (dayIndex + 2) % 7; // Adjust the index
        if (NGAYLAM == 0) NGAYLAM = 7;
        // const periods = [];
    
        let currentStart = null;
    
        for (let hour = 0; hour < 24; hour++) {
            if (row[hour] == '1') {
                if (currentStart === null) {
                    currentStart = hour;
                }
            } else {
                if (currentStart !== null) {
                    currentStart = currentStart < 10 ? `0${currentStart}:00:00` : `${currentStart}:00:00`;
                    const currentEnd = hour < 10 ? `0${hour - 1}:00:00` : `${hour - 1}:00:00`;
                    // periods.push({ NGAYLAM, GIOBATDAU: currentStart, GIOKETTHUC: currentEnd });
                    table.rows.add(mans, NGAYLAM, currentStart, currentEnd);
                    currentStart = null;
                    break;
                }
            }
        }
    
        // Handle the case where the last hour is part of a period
        if (currentStart !== null) {
            currentStart = currentStart < 10 ? `0${currentStart}:00:00` : `${currentStart}:00:00`;
            // periods.push({ NGAYLAM, GIOBATDAU: currentStart, GIOKETTHUC: '23:00:00' });
            table.rows.add(mans, NGAYLAM, currentStart, '23:00:00');
        }
    });

    // console.log(table);
    
    try {
        const pool = await conn;
        const result = (await pool.request()
        .input('MANS', sql.Int, mans)
        .input('NEWLLV', table)
        .execute('SP_UPDATE_LICHLAMVIEC'))
        res.status(200).json('Cập nhật thành công!');
    }
    catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({error: err.message})
    } finally {
        sql.close();
    }
}

module.exports.addNgayNghi_lichlamviec_post = async (req, res) => {
    const mans = req.params.mans;
    const NGAYNGHI = req.body.NGAYNGHI;
    
    try {
        const pool = await conn;
        await pool.request()
        .input('MANS', sql.Int, mans)
        .input('NGAYNGHI', NGAYNGHI)
        .execute('SP_ADD_NGAYNGHI')
        res.status(200).json('Thêm thành công!');
    }
    catch (err) {
        console.error('SQL Server Error:', err.message);
        res.status(400).json({error: err.message})
    } finally {
        sql.close();
    }
}