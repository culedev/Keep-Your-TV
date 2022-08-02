const axios = require("axios");

const service = axios.create({
  baseURL: "https://api.themoviedb.org",
});

const getPopularShowsService = (page) => {
  return service.get(
    `/3/tv/popular?api_key=${process.env.API_KEY}&language=en-US&page=${page}`
  );
};

const getDetailsShowsService = (apiId) => {
  return service.get(
    `/3/tv/${apiId}?api_key=${process.env.API_KEY}&language=en-US`
  );
};
const getGenreList = (page, genreId) => {
  return service.get(
    `/3/discover/tv?api_key=${process.env.API_KEY}&with_genres=${genreId}&page=${page}`
  );
};

const getActors = (showId) => {
  return service.get(`/3/tv/${showId}/credits?api_key=${process.env.API_KEY}&language=en-US
    `);
};

const getActorDetails = (actorId) => {
  return service.get(`/3/person/${actorId}?api_key=${process.env.API_KEY}&append_to_response=credits
    `);
};

const getActorShows = (actorId) => {
  return service.get(`/3/person/${actorId}/tv_credits?api_key=${process.env.API_KEY}`);
};

const searchShow = (query) => {
  return service.get(`/3/search/tv?api_key=${process.env.API_KEY}&language=en-US&page=1&query=${query}&include_adult=false`);
};


const getGenreName = () => {
  return service.get(`3/genre/tv/list?api_key=${process.env.API_KEY}&language=en-US`)
}
const getTopRated = (page) => {
  return service.get(`/3/tv/top_rated?api_key=${process.env.API_KEY}&language=en-US&page=${page}`)
}

const getTrailer = (showId) => {
  return service.get(`3/tv/${showId}/videos?api_key=${process.env.API_KEY}###`)
}



module.exports = {
  getPopularShowsService,
  getDetailsShowsService,
  getGenreList,
  getActors,
  getActorDetails,
  getActorShows,
  searchShow,
  getGenreName,
  getTopRated,
  getTrailer
};
