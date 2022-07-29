const { get } = require("mongoose");

const router = require("express").Router();
const axios = require('axios').default;
const apiKey = process.env.API_KEY

router.get("/home", async (req, res, next) => {

    const test = await axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=1`)
    
    const arrData = test.data.results
    res.render("shows/")
})


module.exports = router;