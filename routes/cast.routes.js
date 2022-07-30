const router = require("express").Router();
const Show = require("../models/Shows.model");

const { getActorDetails, getActorShows } = require("../services");

// GET LIST BY GENRE "/shows/genre/:genreId"
router.get("/:actorId/details", async (req, res, next) => {
  const { actorId } = req.params;
  try {
    
    const actorDetails = await getActorDetails(actorId);
    const actorShows = await getActorShows(actorId);
    res.render("shows/actors-details.hbs", { actorDetails: actorDetails.data, actorShows:actorShows.data.cast.slice(0,5) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
