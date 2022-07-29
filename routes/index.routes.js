const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const authRoutes = require("./auth.routes.js")
router.use("/auth", authRoutes)

const showsRoutes = require("./shows.routes.js")
router.use("/shows", showsRoutes)

module.exports = router;
