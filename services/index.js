const axios = require("axios")

const service = axios.create({
    baseURL: "https://api.themoviedb.org"
})

function getPopularSeriesService() {
    return service.get(`/3/tv/popular?api_key=${process.env.API_KEY}&language=en-US&page=1`)
}

function getGenreList(genreId) {
    return service.get(`/3/discover/movie?api_key=${process.env.API_KEY}&with_genres=${genreId}`)
}

module.exports = {
    getPopularSeriesService, 
    getGenreList
}