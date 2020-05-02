/**
 * Model Schema
 */
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const secret = require("../../config").jwt.secret;

module.exports = {
  /**
   * POST
   */
  create(req, res, next) {
    User.create(req.body)
      .then((user) => {
        res.status(201);
        res.json({
          user: {
            ...user._doc,
            token: jwt.sign({ data: user._doc.username }, secret, {
              expiresIn: "1h",
            }),
          },
        });
      })
      .catch((error) => res.send(500, error));
    next();
  },
  /**
   * POST
   */
  login(req, res, next) {
    console.log(req.body.user.username);
    User.findOne({ username: req.body.user.username })
      .then((user) => {
        console.log(user);
        if (user && user.password === req.body.user.password) {
          res.status(200);
          res.json({
            user: {
              ...user._doc,
              token: jwt.sign({ data: user._doc.username }, secret, {
                expiresIn: "1h",
              }),
            },
          });
        } else {
          res.status(401);
          res.json({ message: "Authentication Error" });
        }
      })
      .catch((error) => res.send(500, error));

    next();
  },
  /**
   * GET
   */
  findByUsername(req, res, next) {
    User.findOne({ username: req.params.username })
      .then((user) => {
        if (user) res.json({ user: user });
        else {
          res.status(404);
          res.json({ message: "Resource not found" });
        }
      })
      .catch((error) => res.send(500, error));

    next();
  },
};
