const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');

router.get('/', (req, res) => {
  Campground.find({}, function(err, campgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render('campground/campgrounds', { campgroundsAll: campgrounds });
    }
  });
});

router.post('/', (req, res) => {
  const newCampground = {
    name: req.body.name,
    image: req.body.image,
    desc: req.body.desc
  };
  Campground.create(newCampground, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

router.get('/new', (req, res) => {
  res.render('campground/new');
});

router.get('/:id', (req, res) => {
  const showCampground = req.params.id;
  Campground.findById(showCampground)
    .populate('comments')
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        res.render('campground/campground', { campground: foundCampground });
      }
    });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
