const router = require("express").Router();
const Show = require("../models/Shows.model");
const User = require("../models/User.model");
const uploader = require("../middleware/uploader");

//GET "/profile/:userId" => show user's profile
router.get("/", async (req, res, next) => {

    res.render("profile/my-profile.hbs")

});

//GET "/profile/lists" => show user's lists
router.get("/lists", async (req, res, next) => {

  try {

    const favShows = await Show.find({$and: [{isFav: true}, {user: req.session.user._id}]})
    const watchedShows = await Show.find({$and: [{status: "watched"}, {user: req.session.user._id}]})
    const pendingShows = await Show.find({$and: [{status: "pending"}, {user: req.session.user._id}]})
    const watchingShows = await Show.find({$and: [{status: "watching"}, {user: req.session.user._id}]})

    res.render("profile/lists.hbs", {
      favShows,
      watchedShows,
      pendingShows,
      watchingShows,
    });
  } catch (err) {
    next(err);
  }
});

// POST "/profile/update" Add an user img
router.post("/update", uploader.single("image"), async (req, res, next) => {
  const { userId } = req.session.user._id;
  try {
    await User.findByIdAndUpdate(userId, {
      image: req.file.path,
    });
    res.redirect("/profile");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
