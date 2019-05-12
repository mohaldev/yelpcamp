const express = require('express'),
      app = express(),
      path = require('path'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      flash = require('connect-flash'),
      User = require('./models/user'),
      passport = require('passport'),
      LocalStrategy = require('passport-local'),
      session = require('express-session'),
      commentRoutes = require('./routes/comments'),
      authRoutes = require('./routes/auth'),
      campRoutes = require('./routes/campgrounds'),
      methodOverride = require('method-override')


mongoose.connect('mongodb://localhost/my_database', { useNewUrlParser: true });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
mongoose.set('useFindAndModify', false);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride('_method'));
app.use(flash());

app.use(
  session({
    secret: 'working great',
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/', authRoutes);
app.use('/campgrounds', campRoutes);

const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
  console.log('Server Working');
});
