

const router = require("express").Router();
const {getPopularSeriesService  } = require("../services")


router.get("/home", async (req, res, next) => {

    const test = await getPopularSeriesService()
    
    const arrData = test.data.results
    res.render("shows/home.hbs", {arrData})
})


module.exports = router;