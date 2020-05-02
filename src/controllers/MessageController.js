/**
 * Model Schema
 */
const Message = require("../models/Message");

module.exports = {
  /**
   * LIST
   */
  findAll(req, res, next) {
    Message.find({})
      .sort("name")
      .then((messages) => res.json(messages))
      .catch((error) => res.send(500, error));

    next();
  },

  /**
   * GET
   */
  findById(req, res, next) {
    Message.findById(req.params.id)
      .then((message) => {
        if (message) res.json(message);
        else {
          res.status(404);
          res.json({ message: "Resource not found" });
        }
      })
      .catch((error) => res.send(500, error));

    next();
  },

  /**
   * POST
   */
  create(req, res, next) {
    Message.create(req.body.message)
      .then((message) => {
        res.status(201);
        res.json(message);
      })
      .catch((error) => res.send(500, error));

    next();
  },

  /**
   * UPDATE
   */
  async update(req, res, next) {
    if (req.params.id) {
      const message = await Message.findById(req.params.id);
      if (!message) {
        res.json({ message: "Resource not found" });
      } else {
        Message.findOneAndUpdate(req.params.id, { ...req.body }, { new: true })
          .then((message) => res.send(message))
          .catch((error) => res.send(500, error));
      }
    } else {
      res.send(400, { message: "Parameter id is required" });
    }
    next();
  },

  /**
   * DELETE
   */
  async delete(req, res, next) {
    if (req.params.id) {
      const message = await Message.findById(req.params.id);
      if (!message) {
        res.json({ message: "Resource not found" });
      } else {
        Message.findOneAndDelete(req.params.id)
          .then((_) => res.send(204))
          .catch((error) => res.send(500, error));
      }
    } else {
      res.send(400, { message: "Parameter id is required" });
    }
    next();
  },
};
