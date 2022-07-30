const router = require("express").Router();
const Show = require("../models/Shows.model");

const {
  getPopularShowsService,
  getDetailsShowsService,
  getGenreList,
  getActors,
} = require("../services");

// GET "/shows" Homepage popular shows
router.get("/", async (req, res, next) => {
  const popularShow = await getPopularShowsService();

  const arrData = popularShow.data.results;
  res.render("shows/home.hbs", { arrData });
});

// GET "/shows/:apiId/details"
router.get("/:showId/details", async (req, res, next) => {
  const { showId } = req.params;
  try {
    const showDetails = await getDetailsShowsService(showId);
    const arrData = showDetails.data;
    const currentShow = await Show.findOne({ apiId: showId });
    const actors = await getActors(showId);

    res.render("shows/details.hbs", {
      arrData,
      currentShow,
      actors: actors.data.cast.slice(0, 5),
    });
  } catch (err) {
    next(err);
  }
});

// POST "/shows/:apId/details" tomar datos y almacenar en DB BOTON FAVORITO
router.post("/:showId/details", async (req, res, next) => {
  const { showId } = req.params;
  const { status, favChecked } = req.body;

  try {
    const showDetails = await getDetailsShowsService(showId);
    const arrData = showDetails.data;

    const showExists = await Show.exists({ apiId: showId });
    const currentShow = await Show.findOne({ apiId: showId });
    const showFav = favChecked === "on" ? true : false;
    const actors = await getActors(showId);

    // FAV CHECK

    if (!showExists) {
      if (status && status === "nostatus") {
        res.render("shows/details.hbs", {
          arrData,
          currentShow,
          actors: actors.data.cast.slice(0, 5),
          error: "METE UN STATUS COÑO",
        });
        return;
      }
      await Show.create({
        apiId: arrData.id,
        name: arrData.name,
        img: arrData.poster_path,
        isFav: showFav,
        status: status,
        user: req.session.user._id,
      });
    } else {
      if (status) {
        await Show.findByIdAndUpdate(currentShow._id, { status: status });
      } else {
        await Show.findByIdAndUpdate(currentShow._id, { isFav: showFav });
      }     
    }
    
    res.redirect(`/shows/${showId}/details`);
  } catch (err) {
    next(err);
  }
});

// GET LIST BY GENRE "/shows/genre/:genreId"
router.get("/genre/:genreId", async (req, res, next) => {
  const { genreId } = req.params;

  const genre = await getGenreList(genreId);
  res.render("shows/shows-by-genre.hbs", { genre: genre.data.results });
});

module.exports = router;
