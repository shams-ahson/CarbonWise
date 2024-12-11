const mongoose = require('mongoose');

// Define the Resource Schema
const resourceSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
        },
    name: {
    type: String,
    required: true,
   // trim: true
  },
  description: {
    type: String,
    required: true
  },
  eco_friendly: {
    type: String,
    enum: ['TRUE', 'FALSE'],
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Grocery Store', 
      'Clothes Market', 
      'Bike/Walk Trail',  
      'Public Transportation'
    ]
  },
  address: {
    type: String,
    required: true
  },
  website: {
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/\S+$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  hours_of_operation: {
    type: String
  },
  image_url: {
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/\S+$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Export the model and import function
const Resource = mongoose.model('Resource', resourceSchema);
module.exports = Resource;