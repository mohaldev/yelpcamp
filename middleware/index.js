const middleware = {};
const Campground = require('../models/campground');
const Comment = require('../models/comment');

middleware.checkIfUserAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        req.flash('error', 'You should be logged in');
        res.redirect('back');
      } else {
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'You should be logged in');
          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('back');
  }
};

middleware.checkIfUserforComment = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        req.flash('error', 'You should be logged in');
        res.redirect('back');
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'You should be logged in');
          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('back');
  }
};

middleware.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please Login first');
  res.redirect('/login');
};

module.exports = middleware;
