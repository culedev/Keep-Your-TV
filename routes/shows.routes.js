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
router.get("/:apiId/details", async (req, res, next) => {
  const { apiId } = req.params;
  try {
    const showDetails = await getDetailsShowsService(apiId);
    const arrData = showDetails.data;
    const actors = await getActors(apiId);

    res.render("shows/details.hbs", {
      arrData,
      actors: actors.data.cast.slice(0, 5),
    });
  } catch (err) {
    next(err);
  }
});

// POST "/shows/:apId/details" tomar datos y almacenar en DB BOTON FAVORITO
router.post("/:showId/details", async (req, res, next) => {
  const { showId } = req.params;

  try {
    const showDetails = await getDetailsShowsService(showId);
    const arrData = showDetails.data;

    const showExists = await Show.exists({ apiId: showId });
    const isShowFav = await Show.findOne({apiId: showId})

    if(showExists === null) {
      await Show.create({
        apiId: arrData.id,
        name: arrData.name,
        img: arrData.poster_path,
        isFav: true,
        user: req.session.user._id,
      });
      res.redirect(`/shows/${showId}/details`);
    }
    
    if (isShowFav.isFav === true) {
      await Show.findByIdAndUpdate(isShowFav._id, {isFav: false})
      res.redirect(`/shows/${showId}/details`)
      return;
    }

    if (isShowFav.isFav === false){
      await Show.findByIdAndUpdate(isShowFav._id, {isFav: true})
      res.redirect(`/shows/${showId}/details`)
      return;
    }

    
  } catch (err) {
    next(err);
  }
});

// POST "/shows/:showId/list/create"
router.get("/shows/:showId/details", async (req,res,next) => {
    const {showId} = req.params
    const {pending, watching, watched, nostatus} = req.body
    console.log(showId, req.body)

    try {
      const showDetails = await getDetailsShowsService(showId);
      const arrData = showDetails.data;
      
      const showExists = await Show.exists({ apiId: showId });
      const isStatus = await Show.findOne({apiId: showId})



      
      // if(showExists === null) {
      //   await Show.create({
      //     apiId: arrData.id,
      //     name: arrData.name,
      //     img: arrData.poster_path,
      //     isFav: false,
      //     status: ,
      //     user: req.session.user._id,
      //   });
      //   res.redirect(`/shows/${showId}/details`);
      // }


      res.redirect(`/shows/${showId}/details`);
    } catch (err) {
      next(err)
    }
})


// GET LIST BY GENRE "/shows/genre/:genreId"
router.get("/genre/:genreId", async (req, res, next) => {
  const { genreId } = req.params;

  const genre = await getGenreList(genreId);
  res.render("shows/shows-by-genre.hbs", { genre: genre.data.results });
});

module.exports = router;
