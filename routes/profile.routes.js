const router = require("express").Router();
const Show = require("../models/Shows.model");


//GET "/profile/lists" => show user's lists
router.get("/", (req, res, next) => {
    res.render("profile/my-profile.hbs");
  });


//GET "/profile/lists" => show user's lists
router.get("/lists", async (req, res, next) => {
    try{
        const favShows=await Show.find({isFav:true})
        const watchedShows=await Show.find({status:"watched"})
        const pendingShows=await Show.find({status:"pending"})
        const watchingShows=await Show.find({status:"watching"})

        console.log(favShows)
        res.render("profile/lists.hbs",{favShows, watchedShows, pendingShows, watchingShows });
    } catch (err) {
      next(err)
    }  
  });

module.exports = router;
