const express=require("express")

const {
    getActionMovies,
    getComedyMovies,
    getHorrorMovies,
    getMovieDetails,
    getRomanceMovies,
    getAnimeMovies,
  } = require("../controller/MovieController");
  
const MovieRouter=express.Router();
MovieRouter.get("/action", getActionMovies);
MovieRouter.get("/comedy", getComedyMovies);
MovieRouter.get("/horror", getHorrorMovies);
MovieRouter.get("/romance", getRomanceMovies);
MovieRouter.get("/anime", getAnimeMovies);
MovieRouter.get("/details", getMovieDetails);
module.exports=MovieRouter