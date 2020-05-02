/**
 * Module Dependencies
 */
const mongoose = require("mongoose");
const mongooseStringQuery = require("mongoose-string-query");
const timestamps = require("mongoose-timestamp");

const MessageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
  },
  { minimize: false }
);

MessageSchema.plugin(timestamps);
MessageSchema.plugin(mongooseStringQuery);

module.exports = mongoose.model("Message", MessageSchema);
