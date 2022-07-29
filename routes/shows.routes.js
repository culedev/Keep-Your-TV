const router = require("express").Router();

const {
  getPopularShowsService,
  getDetailsShowsService,
  getGenreList,
} = require("../services");

// GET "/shows" Homepage popular shows
router.get("/", async (req, res, next) => {
  const popularShow = await getPopularShowsService();

  const arrData = popularShow.data.results;
  res.render("shows/home.hbs", { arrData });
});

// GET "/shows/:apiId/details"
router.get("/:apiId/details", async (req, res, next) => {
  const { apiId } = req.params;

  try {
    const showDetails = await getDetailsShowsService(apiId);
    const arrData = showDetails.data;
    res.render("shows/details.hbs", {
      arrData,
    });
  } catch (err) {
    next(err);
  }
});

// GET LIST BY GENRE "/shows/genre/:genreId"
router.get("/genre/:genreId", async (req, res, next) => {
  const { genreId } = req.params;

  const genre = await getGenreList(genreId);
  console.log (genre.data.results)
  res.render("shows/shows-by-genre.hbs", { genre: genre.data.results });
});

module.exports = router;
