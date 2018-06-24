var Campground= require("../models/campground");
var Comment= require("../models/comment");
//all the middleware goes here
var middlewareObj = {};

// middleware for campground ownership
middlewareObj.CheckCampgroundOwnership = function(req, res, next)
{
    if(req.isAuthenticated())
    {  
        Campground.findById(req.params.id, function(err,foundCampground)
        {
            if(err){
                req.flash("error", "Campground not found in the database!");
                res.redirect("back");
            }
            else
            {
                // does the user own the campground?
                if(foundCampground.author.id.equals(req.user.id))
                {
                    next();
                }
                else
                {
                    req.flash("error", "You dont have the permission to do that!!");
                    res.redirect("back");
                }
            }
        });
    }
    else
    {   req.flash("error", "Please Login to do that!");
        res.redirect("back");
    }
}


// middleware for comment ownership
middlewareObj.CheckCommentOwnership = function(req, res, next)
{
    if(req.isAuthenticated())
    {  
        Comment.findById(req.params.comment_id, function(err,foundComment)
        {
            if(err){
                req.flash("error", "Comment not found in the database!");
                res.redirect("back");
            }
            else
            {
                // does the user own the comment?
                if(foundComment.author.id.equals(req.user.id))
                {
                    next();
                }
                else
                {
                    req.flash("error", "You dont have the permission to do that!!");
                    res.redirect("back");
                }
            }
        });
    }
    else
    {
        req.flash("error", "Please Login to do that!");
        res.redirect("back");
    }
}





//middleware for loggedin
middlewareObj.isLoggedIn = function(req, res, next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    req.flash("error", "Please Login to do that!");
    res.redirect("/login");
}




module.exports = middlewareObj;