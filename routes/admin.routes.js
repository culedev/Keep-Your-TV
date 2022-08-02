const router = require("express").Router();
const Announcement = require("../models/News.model")
const uploader = require("../middleware/uploader");
const { isAdmin } = require("../middleware/auth");

// GET "/admin"
router.get("/", isAdmin, (req, res, next) => {
  res.render("admin/admin.hbs");
});

// GET "/admin/news"
router.get("/news", isAdmin, (req, res, next) => {
  res.render("admin/news.hbs");
});

// POST "/admin/news"
router.post("/news", isAdmin, uploader.single("image"), async (req,res,next) => {
    const {title, url} = req.body

    try {
        await Announcement.create({title, image: req.file.path, url})
        res.redirect("/admin/news")
    } catch (err) {
        next(err)
    }
})


module.exports = router;
