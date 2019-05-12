const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require("../middleware/index")

router.get('/', (req, res) => {
  Campground.find({}, function(err, campgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render('campground/campgrounds', { campgroundsAll: campgrounds });
    }
  });
});

router.post('/', middleware.isLoggedIn, (req, res) => {
  const author = {
    id: req.user._id,
    username: req.user.username
  };
  const newCampground = {
    name: req.body.name,
    image: req.body.image,
    desc: req.body.desc,
    author: author
  };
  Campground.create(newCampground, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      req.flash("success", "Well done! Campground added!")
      res.redirect('/campgrounds');
    }
  });
});

router.get('/new', middleware.isLoggedIn, (req, res) => {
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

router.get('/:id/edit', middleware.checkIfUserAuthenticated, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {  
      res.render('campground/campgroundedit', { campground: foundCampground });
  });
});

router.put('/:id', middleware.checkIfUserAuthenticated, (req, res) => {
  const editCampground = {
    name: req.body.name,
    image: req.body.image,
    desc: req.body.desc
  };
  Campground.findByIdAndUpdate(
    req.params.id,
    editCampground,
    (err, updatedCampground) => {
      if (err) {
        console.log(err);
        res.redirect('/campgrounds');
      } else {
        req.flash("success", "Well done! Campground edited!")
        res.redirect('/campgrounds/' + req.params.id);
      }
    }
  );
});

router.delete('/:id', middleware.checkIfUserAuthenticated, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      req.flash("success", "Well done! Campground deleted")
      res.redirect('/campgrounds');
    }
  });
});

module.exports = router;
