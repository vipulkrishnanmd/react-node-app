/**
 * Module Dependencies
 */
const mongoose = require("mongoose");
const mongooseStringQuery = require("mongoose-string-query");
const timestamps = require("mongoose-timestamp");

const UserSchema = new mongoose.Schema(
  {
    username: {
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
    password: {
      type: String,
    },
  },
  { minimize: false }
);

UserSchema.plugin(timestamps);
UserSchema.plugin(mongooseStringQuery);

module.exports = mongoose.model("User", UserSchema);
