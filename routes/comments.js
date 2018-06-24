 

var express = require("express");
var router =  express.Router({mergeParams:true});
//mergeParams:true takes the :id from comments page and merges with the app.use in the app.js
var Campground = require("../models/campground");
var Comment = require("../models/comment");
//if i require middleware and call the file inxed it is called automatically.
var middleware = require("../middleware");
// ====================
// COMMENTS ROUTES
// ====================


//new comments 
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});
//comments create
router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
            //   add username and ID to comment
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save();
               campground.comments.push(comment);
               campground.save();
               req.flash("success", "Successfully created the comment!");
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });

});
// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.CheckCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id,  function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
      }
   });
});

//COMMENTS update
router.put("/:comment_id", middleware.CheckCommentOwnership, function(req,res)
{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment)
    {
      if(err)
      {
          res.redirect("back");
      }
      else 
      {
        res.redirect("/campgrounds/" + req.params.id);
      } 
    });
});


//Comment delete
router.delete("/:comment_id", middleware.CheckCommentOwnership, function(req, res)
{
    Comment.findByIdAndRemove(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
          req.flash("error", "Comment deleted!");
          res.redirect("/campgrounds/" + req.params.id);
      }
   });
});




module.exports = router;