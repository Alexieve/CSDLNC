const sql = require('mssql')
const config = {
  user: 'sa',
  password: '123',
  server: 'NGUYENKHA',
  database: 'CSDLNC',
  options: {
    encrypt: true, 
    trustServerCertificate: true,
  },
};

const conn = new sql.ConnectionPool(config).connect().then(pool => {
  console.log('Database Connected!');
  return pool;
}).catch(err => console.log('Database Connection Failed! Bad Config: ', err))

module.exports = {
  conn: conn,
  sql: sql,
}

// async function queryDatabase() {
//     try {
//         // Tạo đối tượng kết nối và kết nối đến cơ sở dữ liệu
//         const pool = await sql.connect(config);
//         const script = `SELECT * FROM DIEUTRI`
//         const result = await pool.request().query(script);

//         const data = result.recordset;
//         await sql.close();
//         return data;
//     } catch (err) {
//         console.error('Lỗi truy vấn:', err);
//         throw err; 
//     }
// }

// async function queryDatabase() {
//     try {
//         // Tạo đối tượng kết nối và kết nối đến cơ sở dữ liệu
//         // const pool = await sql.connect(config);
//         const pool = await conn;
//         const script = `SELECT * FROM DIEUTRI WHERE MADIEUTRI = 1`
//         const result = await pool.request().query(script);

//         const data = result.recordset;
//         // await sql.close();
//         return data;
//     } catch (err) {
//         console.error('Lỗi truy vấn:', err);
//         throw err; 
//     }
// }


// queryDatabase().then((data) => {
//     console.log('Data:', data);
// }).catch((err) => {
//     console.error('Error:', err);
// });
