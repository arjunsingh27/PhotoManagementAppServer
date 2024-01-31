const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  data: {
    type: Buffer, // Binary data for the image
    required: true,
  },
  contentType: {
    type: String, // MIME type of the image
    required: true,
  },
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
