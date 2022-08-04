const router = require("express").Router();
const { localsUpdate, isLoggedIn } = require("../middleware/auth");
const User = require("../models/User.model");
const { getGenreName, searchShow } = require("../services");

// Continiously check if user is logged in or not
router.use(localsUpdate);

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//Search results from all the urls in the app
router.get("/shows-search", isLoggedIn, async (req, res, next) => {
  const { search } = req.query;

  if (!search) {
    res.render("shows/no-results");
  }
  try {
    const showFound = await searchShow(search);
    const showUser = await User.find({ username: { $regex: search } });
    const loggedUser = await User.findById(req.session.user._id).populate(
      "friends"
    );

    const loggedUserFriends = loggedUser.friends;
    loggedUserFriends.forEach((eachFriend) => {
      const compare = showUser.filter((eachUser) => {
        if (eachUser._id.valueOf() == eachFriend._id.valueOf()) {
          return eachFriend;
        }
      });

      if (compare.length !== 0){
      compare[0].isFriend = true;}     
    });

    if (showFound.data.total_results === 0) {
      res.render("shows/no-results");
    } else {
      const genreList = await getGenreName();

      showFound.data.results.forEach((show) => {
        const goodArr = show.genre_ids.map((id) => {
          let names = genreList.data.genres.find((idList) => {
            if (id === idList.id) {
              return idList.name;
            }
          });

          return names;
        });
        show.newList = goodArr;
      });
      res.render("shows/shows-search-results.hbs", {
        showFound: showFound.data.results,
        showUser,
      });
    }
  } catch (err) {
    next(err);
  }
});

const authRoutes = require("./auth.routes.js");
router.use("/auth", authRoutes);

const showsRoutes = require("./shows.routes.js");
router.use("/shows", showsRoutes);

const castRoutes = require("./cast.routes.js");
router.use("/cast", castRoutes);

const profileRoutes = require("./profile.routes.js");
router.use("/profile", profileRoutes);

const adminRoutes = require("./admin.routes.js");
router.use("/admin", adminRoutes);

module.exports = router;
