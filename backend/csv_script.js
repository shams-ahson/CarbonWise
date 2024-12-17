const axios = require('axios');
const csvParser = require('csv-parser');
const fs = require('fs');
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjc1NjM4MjAyYjAxNWUyYWUwZDllZWU4IiwiaWF0IjoxNzMzODg5Njc3LCJleHAiOjE3MzM4OTMyNzd9.OWl0XUNYx_EpyyTtMJ8ZKqpPd8QKy_3a3l7fiRf3GBI'
const addResourcesFromCSV = async () => {
  const results = [];
  fs.createReadStream('./resource_db.csv')
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
        console.log(results)
      for (const resource of results) {
        try {
          await axios.post('https://carbonwise-p938.onrender.com/api/resources', resource, {
            headers: { Authorization: `Bearer ${JWT_TOKEN}` },
          });
          console.log('Resource added:', resource.name);
        } catch (err) {
          console.error('Error adding resource:', err.message);
        }
      }
    });
};

addResourcesFromCSV();
