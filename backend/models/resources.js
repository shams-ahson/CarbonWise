const mongoose = require('mongoose');

// Define the Resource Schema
const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  ecoFriendly: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Grocery Store', 
      'Clothes Market', 
      'Bike/Walk Trail', 
      'Biking Trail', 
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
  hoursOfOperation: {
    type: String
  },
  imageUrl: {
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

// Create a method to find resources by category
resourceSchema.statics.findByCategory = function(category) {
  return this.find({ category: category });
};

// Create a method to find eco-friendly resources
resourceSchema.statics.findEcoFriendly = function() {
  return this.find({ ecoFriendly: true });
};

// Create the model
const Resource = mongoose.model('Resource', resourceSchema);

// Function to bulk import resources from CSV
async function importResourcesFromCSV() {
  // You'll need to use a CSV parsing library like csv-parse
  const fs = require('fs');
  const csv = require('csv-parse');

  const resources = [];
  
  fs.createReadStream('Cleaned_Resources_Table.csv')
    .pipe(csv.parse({ columns: true, trim: true }))
    .on('data', (row) => {
      resources.push({
        name: row.Name,
        description: row.Description,
        ecoFriendly: row.Eco_Friendly === 'yes',
        category: row.Category,
        address: row.Address,
        website: row.Website,
        hoursOfOperation: row['Hours of Operation'],
        imageUrl: row.Image
      });
    })
    .on('end', async () => {
      try {
        // Clear existing resources before importing
        await Resource.deleteMany({});
        
        // Insert new resources
        await Resource.insertMany(resources);
        
        console.log(`Imported ${resources.length} resources successfully`);
      } catch (error) {
        console.error('Error importing resources:', error);
      }
    });
}

// Export the model and import function
module.exports = {
  Resource,
  importResourcesFromCSV
};