const UserModel = require("../models/Usermodel");
const { tmdbApi, TMDB_ENDPOINT } = require("../services/tmdb");
const jwt = require("jsonwebtoken");
/*********************users********************/

const getCurrentUser = async (req, res) => {
  try {
    // const userId = req.userId;
    const token=req.cookies.jwt
    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
        status: "failure",
      });
    }

    // Verify and decode the JWT token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Get userId from the decoded token
    const userId = decoded.id;

   const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "failure",
      });
    }

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        wishlist: user.wishlist,
        isPremium: user.isPremium,
      },
      status: "success",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
      status: "failure",
    });
  }
};


const getUserWishlist = async (req, res) => {
  try {
      const userId = req.userId;
      const user = await UserModel.findById(userId);
      res.status(200).json({
          data: user.wishlist,
          status: "success",
      });
  } catch (err) {
      res.status(500).json({
          message: err.message,
          status: "failure",
      });
  }
};


const addToWishlist = async (req, res) => {
  try {
    const token=req.cookies.jwt
    // console.log(token)
    const userId = req.userId;
    const { id, poster_path, name,media_type} = req.body;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (user.wishlist.find(item => item.id === id)) {
      return res.status(400).json({
          message: "Item already in wishlist",
          status: "failure",
      });
  }

    // let postItem;
    // if (media_type == "tv") {
    //   postItem = (await tmdbApi.get(TMDB_ENDPOINT.fetchTvShowDetails(id))).data;
    // } else {
    //   postItem = (await tmdbApi.get(TMDB_ENDPOINT.fetchMovieDetails(id))).data;
    // }
    // console.log("pos", postItem);
    const wishlistItem = {
      poster_path: poster_path,
      name: name,
      id: id,
      media_type: media_type,
  };

    user.wishlist.push(wishlistItem);
    await UserModel.findOneAndUpdate(
      { _id: userId },
      { $push: { wishlist: wishlistItem } },
      { new: true, upsert: true } // options to return the updated document and create if it doesn't exist
    );
    console.log(user.wishlist)
    res.status(200).json({
      status: "success",
      data:token
    });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({
      message: error.message,
      status: "failure",
      
    });
  }
};

module.exports = {
  getCurrentUser,
  addToWishlist,
  getUserWishlist
};