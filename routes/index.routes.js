const router = require("express").Router();
const { localsUpdate } = require("../middleware/auth");

// Continiously check if user is logged in or not
router.use(localsUpdate);

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const authRoutes = require("./auth.routes.js");
router.use("/auth", authRoutes);

const showsRoutes = require("./shows.routes.js");
router.use("/shows", showsRoutes);

const castRoutes = require("./cast.routes.js");
router.use("/cast", castRoutes);

module.exports = router;
