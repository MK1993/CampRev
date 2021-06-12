if(process.env.NODE_ENV!=='production'){
  require('dotenv').config()
}

const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')
const session = require('express-session')
const flash = require('express-flash')
const User = require('./models/user')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const users = require('./routes/users')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require("helmet")
const MongoStore = require('connect-mongo');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/camp_rev'
const secret = process.env.SECRET || 'thisissecuresecret'

const configSess = {
  secret,
  name: 'CampRevSession',
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true,expires:new Date(Date.now() + 3600000) },
  store: MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600
  })
}

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended:true}))
app.use(session(configSess))
app.use(methodOverride('_method'))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, 'public')))
app.use((req, res, next) => {
  res.locals.currentUser = req.user
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})
app.use(mongoSanitize({
  replaceWith: '_',
}))
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);


app.use('/', users)
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

app.get('/', (req, res) => {
  res.render('home')
})

app.all('*',(req,res,next)=>{
  next(new ExpressError('Page Not Found',404))
})

app.use((err,req,res,next)=>{
  const {message='Something went wrong',statusCode=500} = err
  if(!message) message = 'Oh No! something went wrong!'
  res.status(statusCode).render('error',{err})
})

app.listen(process.env.PORT || 3000)