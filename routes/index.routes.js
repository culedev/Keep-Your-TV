const router = require("express").Router();
const { localsUpdate } = require("../middleware/auth");

const { getGenreName, searchShow } = require("../services");

// Continiously check if user is logged in or not
router.use(localsUpdate);

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//Search results from all the urls in the app
router.get("/shows-search", async (req, res, next) => {
  const { search } = req.query;
  if (!search) {
    res.render("shows/no-results");
  }
  try {
    const showFound = await searchShow(search);
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
