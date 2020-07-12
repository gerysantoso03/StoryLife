// Global Imports
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db');

// Global Variables
const PORT = process.env.PORT || 3000;

// Load config
dotenv.config({ path: './config/.env' });

// Passport config
require('./config/passport')(passport);

// Database Setup
connectDB();

// Application setup
const app = express();

// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method Override
app.use(
  methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Handlebars Helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require('./helpers/handlebars');

// Express Handlebars
// For setting views extension into .hbs
app.engine(
  '.hbs',
  exphbs({
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select,
    },
    defaultLayout: 'main',
    extname: '.hbs',
  })
);
app.set('view engine', '.hbs');

// Express Sessions
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport Middlewares
app.use(passport.initialize());
app.use(passport.session());

// Making global variable to access local user
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

app.listen(
  PORT,
  console.log(
    `Server is running on ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);

module.exports = app;
