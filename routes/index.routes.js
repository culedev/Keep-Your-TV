const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const authRoutes = require("./auth/auth.routes.js")
router.use("/auth", authRoutes)

module.exports = router;
