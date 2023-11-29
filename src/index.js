// Require Module
const cookieParser = require('cookie-parser')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()   
const {conn, sql} = require('./middleware/database')
// Require Routes
const authRoutes = require('./routes/authRoutes')
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
// Listen
const port = 3000
app.listen(port, function(){
    console.log(`Server started on port ${port}`);
});