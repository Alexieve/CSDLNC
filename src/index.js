// Require Module
const cookieParser = require('cookie-parser')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()   
const sql = require('mssql')

// Require Routes
// const authRoutes = require('./routes/authRoutes')
// const bookRoutes = require('./routes/bookRoutes')
// const profileRoutes = require('./routes/profileRoutes');
// const bookMarkRoutes = require('./routes/bookMarkRoutes');
// const uploadRoutes = require('./routes/uploadRoutes');
// const bookInfoRoutes = require('./routes/bookInfoRoutes'); // Add the bookInfoRoutes
// const readingHistoryRoutes = require('./routes/readingHistoryRoutes');
// const notificationRoutes = require('./routes/notificationRoutes');
// const { requireAuth, checkUser} = require('./middleware/authMiddleware')
// const manageRoutes = require('./routes/manageRoutes')
// const manageBookRoutes = require('./routes/manageBookRoutes')
// const manageUserRoutes = require('./routes/manageUserRoutes')
// const manageCommentRoutes = require('./routes/manageCommentRoutes')
// const managePendingRoutes = require('./routes/managePendingRoutes')
// const searchRoutes = require('./routes/searchRoutes')

// Database connection
const config = {
  user: 'sa',
  password: '123',
  server: 'ATLAZ/SQLEXPRESS',
  database: 'CSDLNC',
  options: {
    encrypt: true, // Nếu sử dụng kết nối bảo mật, hãy đặt giá trị này thành true
    trustServerCertificate: true,
  },
};

// const pool = new sql.ConnectionPool(config);
// const poolConnect = pool.connect();

async function queryDatabase() {
    try {
      // Tạo đối tượng kết nối và kết nối đến cơ sở dữ liệu
      const pool = await sql.connect(config);
  
      // Thực hiện truy vấn
      const result = await pool.request().query('SELECT * FROM THUOC');
  
      // Lấy dữ liệu từ kết quả truy vấn
      const data = result.recordset;
  
      // Đóng kết nối
      await sql.close();
  
      // Trả dữ liệu về biến hoặc thực hiện các thao tác khác tùy thuộc vào nhu cầu
      return data;
    } catch (err) {
      console.error('Lỗi truy vấn:', err);
      throw err; // xử lý hoặc chuyển tiếp lỗi nếu cần
    }
}

queryDatabase()
  .then((data) => {
    console.log('Data:', data);
  })
  .catch((err) => {
    console.error('Error:', err);
  });


// Sử dụng kết nối
// poolConnect.then(() => {
//     console.log('Connected to SQL Server');
//     // Thực hiện các thao tác cơ sở dữ liệu ở đây

//     // Ví dụ: Truy vấn dữ liệu
//     return pool.query`SELECT * FROM DIEUTRI`;
// }).then((result) => {
//     console.log(result.recordset);
// }).catch((err) => {
//     console.error('Error:', err);
// });

// Use and Set Module
// app.use(express.static(path.join(__dirname, './public')))
// app.set('views', path.join(__dirname, './views'))
// app.set('view engine', 'ejs');
// app.use(express.json())
// app.use(bodyParser.json())
// app.use(cookieParser())
// app.use(bodyParser.urlencoded({ extended: true}))


// Routes
// app.get('*', checkUser);
// app.use(bookRoutes)
// app.use(authRoutes)
// app.use(bookMarkRoutes)
// app.use(uploadRoutes)
// app.use(readingHistoryRoutes)
// app.use(notificationRoutes)
// app.use(searchRoutes)
// app.get("/", (req, res) => res.render('home'));
// app.use('/profile',profileRoutes);
// app.get("/bookmark", requireAuth, (req, res) => res.render('bookmark'));
// app.use('/book', bookInfoRoutes); // Add the bookInfoRoutes
// app.get("/filter",(req,res) => res.render('filter'));
// app.use(manageRoutes)
// app.use(manageBookRoutes)
// app.use(manageUserRoutes)
// app.use(manageCommentRoutes)
// app.use(managePendingRoutes)
// app.use((req, res, next) => {
//     // Set cache control headers to prevent caching for all responses
//     res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
//     next();});
// Listen
const port = 3000
app.listen(port, function(){
    console.log(`Server started on port ${port}`);
});