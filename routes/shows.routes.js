const router = require("express").Router();
const Show = require("../models/Shows.model")

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

// POST "/shows/:apId/details" tomar datos y almacenar en DB
router.post("/:apiId/details", async (req, res, next) => {
  const { apiId } = req.params;

  try {
    const showDetails = await getDetailsShowsService(apiId);
    const arrData = showDetails.data;
    await Show.create({
        apiId: arrData.id,
        name: arrData.name,
        img: arrData.poster_path,
        isFav: true,
    })
    res.redirect("/shows")

  } catch (err) {
    next(err);
  }
});

// GET LIST BY GENRE "/shows/genre/:genreId"
router.get("/genre/:genreId", async (req, res, next) => {
  const { genreId } = req.params;

  const genre = await getGenreList(genreId);
  console.log(genre.data.results);
  res.render("shows/shows-by-genre.hbs", { genre: genre.data.results });
});

module.exports = router;
