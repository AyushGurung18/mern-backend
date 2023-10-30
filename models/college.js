const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    required: true,
  },
  progOffered: [
    {
      type: String,
    },
  ],
  estYear: {
    type: Number,
    required: true,
  },
});

const College = mongoose.model('College', collegeSchema);

module.exports = College;