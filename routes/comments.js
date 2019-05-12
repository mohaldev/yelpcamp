const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require("../middleware/index")

router.get('/new', middleware.isLoggedIn, (req, res) => {
  const campgroundToShow = req.params.id;
  Campground.find({ _id: campgroundToShow }, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comment/commentnew', { campground: foundCampground });
    }
  });
});

router.post('/', middleware.isLoggedIn, (req, res) => {
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
          req.flash("success", "Well done! Comment  added!")
          res.redirect('/campgrounds/' + foundCampground._id);
        }
      });
    }
  });
});

router.get('/:comment_id/edit', middleware.checkIfUserforComment, (req, res) => {
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

router.put('/:comment_id', middleware.checkIfUserforComment, (req, res) => {
  console.log(req.body);
  Comment.findByIdAndUpdate(req.params.comment_id, req.body, (err, updated) => {
    if (err) {
      console.log(err);
    } else {
      req.flash("success", "Well done! Commment edited!")
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

router.delete('/:comment_id', middleware.checkIfUserforComment, (req, res) => {
  Comment.findByIdAndDelete(req.params.comment_id, err => {
    if (err) {
      res.redirect('back');
    } else {
      req.flash("success", "Well done! Comment deleted!")
      res.redirect('back');
    }
  });
});

module.exports = router;
