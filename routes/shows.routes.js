const router = require("express").Router();
const Show = require("../models/Shows.model");
const Review = require("../models/Review.model");
const User = require("../models/User.model");
const Announcement = require("../models/News.model");
const { isLoggedIn, isUserBan, isAdmin } = require("../middleware/auth");
const {
  getPopularShowsService,
  getDetailsShowsService,
  getGenreList,
  getActors,
  getGenreName,
  getTopRated,
  getTrailer,
} = require("../services");

// GET "/shows" Homepage popular shows
router.get("/", async (req, res, next) => {
  try {
    const popularShow = await getPopularShowsService();
    const announcements = await Announcement.find();

    const arrData = popularShow.data.results;
    res.render("shows/home.hbs", { arrData, announcements });
  } catch (err) {
    next(err);
  }
});

// GET "/shows/:apiId/details"
router.get("/:showId/details", async (req, res, next) => {
  const { showId } = req.params;
  try {
    const showDetails = await getDetailsShowsService(showId);
    const arrData = showDetails.data;
    const actors = await getActors(showId);
    const review = await Review.find({ show: showId }).populate("user");
    const adminUser = await User.find({ role: "admin" });
    const trailer = await getTrailer(showId);
    const firstTrailer = trailer.data.results.find(
      (trailerObj) => trailerObj.type === "Trailer"
    );

    if (typeof req.session.user !== "undefined") {
      const currentShow = await Show.findOne({
        $and: [{ apiId: showId }, { user: req.session.user._id }],
      });
      res.render("shows/details.hbs", {
        arrData,
        currentShow,
        actors: actors.data.cast.slice(0, 5),
        review,
        adminUser,
        firstTrailer,
      });
    } else {
      res.render("shows/details.hbs", {
        arrData,
        actors: actors.data.cast.slice(0, 5),
        review,
      });
    }
  } catch (err) {
    next(err);
  }
});

// POST "/shows/:apId/details" tomar datos y almacenar en DB BOTON FAVORITO
router.post(
  "/:showId/details",
  isLoggedIn,
  isUserBan,
  async (req, res, next) => {
    const { showId } = req.params;
    const { status, favChecked, title, review, star } = req.body;
    try {
      const showDetails = await getDetailsShowsService(showId);
      const arrData = showDetails.data;
      const currentShow = await Show.findOne({
        $and: [{ apiId: showId }, { user: req.session.user._id }],
      });
      const showFav = favChecked === "on" ? true : false;
      const actors = await getActors(showId);

      // FAV ICON + LISTS
      if (!currentShow) {
        if (status === "nostatus") {
          res.render("shows/details.hbs", {
            arrData,
            currentShow,
            actors: actors.data.cast.slice(0, 5),
            error: "You have to select a valid status",
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
          await Show.findByIdAndUpdate(currentShow._id, {
            status: status,
          });
        } else {
          await Show.findByIdAndUpdate(currentShow._id, {
            isFav: showFav,
          });
        }
      }

      // REVIEW + STARS
      if (title && review && star) {
        await Review.create({
          show: showId,
          star,
          title,
          review,
          user: req.session.user._id,
        });
      }
      res.redirect(`/shows/${showId}/details`);
    } catch (err) {
      next(err);
    }
  }
);

// GET LIST BY GENRE "/shows/genre/:genreId"
router.get("/:page/genre/:genreId", async (req, res, next) => {
  const { page, genreId } = req.params;

  try {
    const genre = await getGenreList(page, genreId);
    const genreList = await getGenreName();
    const currentGenre = genreList.data.genres.find(
      (genreObj) => genreObj.id === parseInt(genreId)
    );

    genre.data.results.forEach((show) => {
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
    res.render("shows/shows-by-genre.hbs", {
      genre: genre.data.results,
      genreName: currentGenre,
    });
  } catch (err) {
    next(err);
  }
});

// GET POPULAR SHOWS "/shows/popular-shows"
router.get("/:page/popular-shows", async (req, res, next) => {
  const { page } = req.params;
  const popularShow = await getPopularShowsService(page);
  const genreList = await getGenreName();

  popularShow.data.results.forEach((show) => {
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

  const arrData = popularShow.data.results;
  res.render("shows/popular-shows.hbs", { arrData });
});

// GET TOP SHOWS "/shows/top-shows"
router.get("/:page/top-shows", async (req, res, next) => {
  const { page } = req.params;
  const topRatedShows = await getTopRated(page);
  const genreList = await getGenreName();

  topRatedShows.data.results.forEach((show) => {
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
  const topShows = topRatedShows.data.results;
  res.render("shows/top-shows.hbs", { topShows });
});

// POST "/shows/:showId/details/delete"
router.post("/:showId/details/delete", isLoggedIn, async (req, res, next) => {
  const { showId } = req.params;
  try {
    await Review.findOneAndDelete({
      $and: [{ user: req.session.user._id }, { show: showId }],
    });
    res.redirect(`/shows/${showId}/details`);
  } catch (err) {
    next(err);
  }
});

// POST "/shows/:showId/banned"
router.post("/:showId/:userId/banned", isAdmin, async (req, res, next) => {
  const { showId, userId } = req.params;
  try {
    await User.findByIdAndUpdate(userId, { isBanned: true });

    res.redirect(`/shows/${showId}/details`);
  } catch (err) {
    next(err);
  }
});



module.exports = router;
