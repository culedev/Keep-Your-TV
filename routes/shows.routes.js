

const router = require("express").Router();
const {getPopularSeriesService  } = require("../services")
const {getGenreList} = require("../services")


router.get("/", async (req, res, next) => {

    const test = await getPopularSeriesService()
    
    const arrData = test.data.results
    res.render("shows/home.hbs", {arrData})
})

router.get ("/genre/:genreId", async (req, res, next) => {
 const {genreId} =req.params
 
const genre = await getGenreList(genreId)
console.log(genre)
 res.render("shows/shows-by-genre.hbs", {genre})

})

module.exports = router;