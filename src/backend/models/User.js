const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: function () {
      // Password is only required if they are signing up using local auth
      return this.authProvider === 'local';
    }
  },

  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },

  googleId: {
    type: String,
    unique: true,
    sparse: true
  }

});

module.exports = mongoose.model("User", UserSchema);