
var express = require("express");
var router =  express.Router();
var Campground = require("../models/campground");
//if i require middleware and call the file inxed it is called automatically.
var middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
       }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author:author}
    
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground.description);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//Edit campground
router.get("/:id/edit", middleware.CheckCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err,foundCampground)
    {
        res.render("campgrounds/edit", {campground: foundCampground});     
    });
});

// update campground
router.put("/:id", middleware.CheckCampgroundOwnership, function(req,res)
{
    //find and update correct campg
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    {
       res.redirect("/campgrounds/"+ req.params.id);}
    });
    // redirect showpage
});

//destroy campground 
router.delete("/:id", middleware.CheckCampgroundOwnership, function(req,res)
{
    Campground.findByIdAndRemove(req.params.id, function(err,foundCampground)
    {
         res.redirect("/campgrounds");
    });
});





module.exports = router;