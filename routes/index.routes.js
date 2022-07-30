const router = require("express").Router();
const { localsUpdate } = require("../middleware/auth");

const {
  searchShow
} = require("../services");

// Continiously check if user is logged in or not
router.use(localsUpdate);

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


//Search results from all the urls in the app
router.get("/shows-search", async (req, res, next) => {
  const {search} = req.query
  if (!search) {
    res.redirect ("/shows") 
 }
  try {   
    const showFound = await searchShow (search)
    res.render ("shows/shows-search-results.hbs", {showFound: showFound.data.results})  
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
const User = require("../models/User.model");
router.use("/profile", profileRoutes);

module.exports = router;
