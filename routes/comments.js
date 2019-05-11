const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");

router.get('/new', isLoggedIn, (req, res) => {
  const campgroundToShow = req.params.id;
  Campground.find({ _id: campgroundToShow }, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comment/commentnew', { campground: foundCampground });
    }
  });
});

router.post('/', isLoggedIn, (req, res) => {
  const campgroundForComments = req.params.id;
  Campground.findById(campgroundForComments, (err, foundCampground) => {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      const newComment = {
        author: req.body.author,
        text: req.body.text
      };
      Comment.create(newComment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          foundCampground.comments.push(comment);
          foundCampground.save();
          res.redirect('/campgrounds/' + foundCampground._id);
        }
      });
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
