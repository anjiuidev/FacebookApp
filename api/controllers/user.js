const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require('../models/user');

const createToken = (auth) => {
  return jwt.sign({
    id: auth.id
  }, 'my-secret',
  {
    expiresIn: 60 * 120
  });
};

const generateToken = (req, res, next) => {
  req.token = createToken(req.auth);
  next();
};

const sendToken = (req, res) => {
  res.setHeader('x-auth-token', req.token);
  res.status(200).send(req.auth);
};

exports.facebook_auth = (req, res, next) => {
  passport.authenticate('facebook-token', {session: false}), (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        "error": "User Not Authenticated"
      });
    }

    // prepare token for API
    req.auth = {
      id: req.user.id
    };

    next();
  }, generateToken, sendToken
}

exports.get_single_user = (req, res, next) => {
  res.status(400).json({
    "data": "data"
  });
  User.findById({ _id: req.auth.id }).exec()
    .then(result => {
      res.status(200).json({
        user: result
      });
    })
    .catch(err => {
      console.log("Error:", err);
      res.status(500).json({
        "error": err
      });
    });
}