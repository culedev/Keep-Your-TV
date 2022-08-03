const router = require("express").Router();
const Announcement = require("../models/News.model");
const uploader = require("../middleware/uploader");
const User = require("../models/User.model")
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
router.post(
  "/news",
  isAdmin,
  uploader.single("image"),
  async (req, res, next) => {
    const { title, url } = req.body;

    try {
      await Announcement.create({ title, image: req.file.path, url });
      res.redirect("/admin/news");
    } catch (err) {
      next(err);
    }
  }
);

// GET "/admin/listbanned"
router.get("/listbanned", async (req, res, next) => {
  try {
    const bannedUser = await User.find({ isBanned: true });
    res.render("admin/listbanned.hbs", {
      bannedUser,
    })
  } catch (err) {
    next(err);
  }
});


//POST "/admin/{{this._id}}/unbanned" 
router.post("/:userId/unban", isAdmin, async (req, res, next) => {
  const {userId } = req.params;
  try {
    await User.findByIdAndUpdate(userId, { isBanned: false });

    res.redirect(`/admin/listbanned`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
