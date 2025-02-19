const express = require("express");
const UserRouter = express.Router();
const { getCurrentUser, addToWishlist } = require("../controller/UserController");
const { protecdrouteMiddleware } = require("../controller/AuthController");
/***********routes**************/
/**********users*****/
UserRouter.use(protecdrouteMiddleware);
UserRouter.get("/", getCurrentUser);
UserRouter.post("/wishlist", addToWishlist);

module.exports = UserRouter;