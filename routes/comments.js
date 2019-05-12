const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Comment = require('../models/comment');

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
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          foundCampground.comments.push(comment);
          foundCampground.save();
          res.redirect('/campgrounds/' + foundCampground._id);
        }
      });
    }
  });
});

router.get('/:comment_id/edit', (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if (err) {
      res.redirect('back');
    } else {
      res.render('comment/commentedit', {
        comment: foundComment,
        campgroundid: req.params.id
      });
    }
  });
});

router.put('/:comment_id', (req, res) => {
  console.log(req.body);
  Comment.findByIdAndUpdate(req.params.comment_id, req.body, (err, updated) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

router.delete('/:comment_id', (req, res) => {
  Comment.findByIdAndDelete(req.params.comment_id, err => {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect('back');
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
