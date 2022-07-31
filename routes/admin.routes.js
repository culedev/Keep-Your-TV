const router = require("express").Router();
const {isAdmin} = require("../middleware/auth");

// GET "/admin"
router.get("/", isAdmin, (req, res, next) => {
    res.render("admin/admin.hbs")
})

module.exports = router;