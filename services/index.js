const axios = require("axios")

const service = axios.create({
    baseURL: "https://api.themoviedb.org"
})

const getPopularShowsService = () => {
    return service.get(`/3/tv/popular?api_key=${process.env.API_KEY}&language=en-US&page=1`)
}

const getDetailsShowsService = (apiId) => {
    return service.get(`3/tv/${apiId}?api_key=${process.env.API_KEY}&language=en-US`)
}

module.exports = {
    getPopularShowsService,
    getDetailsShowsService
}