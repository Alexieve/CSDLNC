// Require Module
const cookieParser = require('cookie-parser')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()   
// Require Routes

const authRoutes = require('./routes/authRoutes')
const HSBN_Routes = require('./routes/HSBN_Routes')
const LICHHEN_Routes = require('./routes/LICHHEN_Routes')
const THUOC_Routes = require('./routes/THUOC_Routes')
const HOADON_Routes = require('./routes/HOADON_Routes')
const LICHLAMVIEC_Routes = require('./routes/LICHLAMVIEC_Routes')
const {requireAuth, checkUser} = require('./middleware/authMiddleware')
const listNVRoutes = require('./routes/listNV_Routes')
const listNSRoutes = require('./routes/listNS_Routes')
const NV_LichHen_Routes = require('./routes/NV_LichHen_Routes')
const KHDTRoutes = require('./routes/KHDTRoutes')
// Use and Set Module
app.use(express.static(path.join(__dirname, './public')))
app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'ejs');
app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true}))


// Routes
app.get('*', checkUser)
app.use(authRoutes)
app.use(HSBN_Routes)
app.use(LICHHEN_Routes)
app.use(THUOC_Routes)
app.use(HOADON_Routes)
app.use(LICHLAMVIEC_Routes)
app.use(listNVRoutes)
app.use(listNSRoutes)
app.use(NV_LichHen_Routes)
app.use(KHDTRoutes)
// Listen
const port = 3000
app.listen(port, function(){
    console.log(`Server started on port ${port}`);
});
