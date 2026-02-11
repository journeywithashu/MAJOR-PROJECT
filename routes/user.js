const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsyc = require("../utils/wrapAsyc.js");
const passport = require("passport");
const { savedRedirectURL } = require("../middleware.js");
const userController = require("../controllers/user.js");

router.get("/signup",userController.renderSignup);

router.post("/signup",wrapAsyc(userController.signup));

router.get("/login",userController.renderLogin);

router.post("/login",
     savedRedirectURL,
     passport.authenticate("local",
          {failureRedirect:"/login",
               failureFlash:true
          }), 
     userController.login
);

router.get("/logout", userController.logout);

module.exports = router;