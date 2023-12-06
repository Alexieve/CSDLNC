// Require Module
const cookieParser = require('cookie-parser')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()   
// Require Routes

const authRoutes = require('./routes/authRoutes')
const KH_HSBN_Routes = require('./routes/KH_HSBN_Routes')
const THUOC_Routes = require('./routes/THUOC_Routes')
const HOADON_Routes = require('./routes/HOADON_Routes')
const {requireAuth, checkUser} = require('./middleware/authMiddleware')

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
app.use(KH_HSBN_Routes)
app.use(THUOC_Routes)
app.use(HOADON_Routes)
// Listen
const port = 3000
app.listen(port, function(){
    console.log(`Server started on port ${port}`);
});