const router = require("express").Router();
const Show = require("../models/Shows.model");
const User = require("../models/User.model");
const uploader = require("../middleware/uploader");
const { isLoggedIn } = require("../middleware/auth");

//GET "/profile" => show user's profile
router.get("/", isLoggedIn, async (req, res, next) => {

    res.render("profile/my-profile.hbs")

});

//GET "/profile/lists" => show user's lists
router.get("/lists", isLoggedIn, async (req, res, next) => {

  try {

    const favShows = await Show.find({$and: [{isFav: true}, {user: req.session.user._id}]})
    const watchedShows = await Show.find({$and: [{status: "watched"}, {user: req.session.user._id}]})
    const pendingShows = await Show.find({$and: [{status: "pending"}, {user: req.session.user._id}]})
    const watchingShows = await Show.find({$and: [{status: "watching"}, {user: req.session.user._id}]})

    res.render("profile/lists/lists.hbs", {
      favShows:favShows.slice(0,5),
      watchedShows:watchedShows.slice(0,5),
      pendingShows:pendingShows.slice(0,5),
      watchingShows:watchingShows.slice(0,5),
    });
  } catch (err) {
    next(err);
  }
});

//GET "/profile/lists/my-favorites" => show all favorites
router.get("/lists/my-favorites", isLoggedIn, async (req, res, next)=> {
  try {
    const favShows = await Show.find({$and: [{isFav: true}, {user: req.session.user._id}]})
    res.render("profile/lists/my-favorites.hbs", {
      favShows
    })
  } catch (err) {
    next(err);
  }
})

//GET "/profile/lists/watching-shows" => show all the shows I'm watching
router.get("/lists/watching-shows", isLoggedIn, async (req, res, next)=> {
  try {
    const watchingShows = await Show.find({$and: [{status: "watching"}, {user: req.session.user._id}]})
    res.render("profile/lists/watching-shows.hbs", {
      watchingShows
    })
  } catch (err) {
    next(err);
  }
})

//GET "/profile/lists/watched-shows" => show all the shows I've watched
router.get("/lists/watched-shows", isLoggedIn, async (req, res, next)=> {
  try {
    const watchedShows = await Show.find({$and: [{status: "watched"}, {user: req.session.user._id}]})
    res.render("profile/lists/watched-shows.hbs", {
      watchedShows
    })
  } catch (err) {
    next(err);
  }
})

//GET "/profile/lists/pending-shows" => show all the shows I've watched
router.get("/lists/pending-shows", isLoggedIn, async (req, res, next)=> {
  try {
    const pendingShows = await Show.find({$and: [{status: "pending"}, {user: req.session.user._id}]})
    res.render("profile/lists/pending-shows.hbs", {
      pendingShows
    })
  } catch (err) {
    next(err);
  }
})



// POST "/profile/update" Add an user img
router.post("/update", isLoggedIn, uploader.single("image"), async (req, res, next) => {
  const userId = req.session.user._id;
  try {
    await User.findByIdAndUpdate(userId, {
      image: req.file.path,
    });

    req.session.user.image = req.file.path

    req.session.save(() => {
      res.redirect("/profile");
    })

  } catch (err) {
    next(err);
  }
});

//GET "/profile/friends-list" =>lista de amigos

router.get ("/friends-list", isLoggedIn, async(req,res,next)=> {
  
  try {
    const user= await User.findById(req.session.user._id).populate("friends", {"username":1 , "role":1, "image":1})
    res.render("profile/lists/friends-list.hbs", {
      friends: user.friends,
    })
  } catch (err) {
    next(err);
  }

})

//POST "/profile/:userId/add-friend => Add friend
router.post("/:userId/add-friend", isLoggedIn, async (req, res, next)=> {
const {userId} = req.params

  try {
    const userAdded = await User.findById(userId)
    const userLogged = await User.findById(req.session.user._id)

    await User.findByIdAndUpdate(userLogged._id, {$addToSet: {friends: userAdded._id}});
    
    req.session.save(() => {
      res.redirect("/profile/friends-list");
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router;
