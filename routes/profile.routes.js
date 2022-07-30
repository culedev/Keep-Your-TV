const router = require("express").Router();
const Show = require("../models/Shows.model");


//GET "/profile/lists" => show user's lists
router.get("/", (req, res, next) => {
    res.render("profile/my-profile.hbs");
  });


//GET "/profile/lists" => show user's lists
router.get("/lists", async (req, res, next) => {
    try{
        const favShows=await Show.find({$and: [{isFav:true}, {user:req.session.user._id}]})
        const watchedShows=await Show.find({$and: [{status:"watched"},{user:req.session.user._id}]})
        const pendingShows=await Show.find({$and: [{status:"pending"},{user:req.session.user._id}]})
        const watchingShows=await Show.find({$and: [{status:"watching"},{user:req.session.user._id}]})
  

        console.log(favShows)
        res.render("profile/lists.hbs",{favShows, watchedShows, pendingShows, watchingShows });
    } catch (err) {
      next(err)
    }  
  });

module.exports = router;
