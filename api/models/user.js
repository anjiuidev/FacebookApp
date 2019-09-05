const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: {type: String},
  lastName: {type: String},
  email: {
    type: String, required: true,
    trim: true, unique: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  },
  facebookProvider: {
    type: {
      id: String,
      token: String
    },
    select: false
  }
});

module.exports = mongoose.model('User', userSchema);