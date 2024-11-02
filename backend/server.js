// backend/server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5001;

// verify server is running
app.get('/', (req, res) => {
  res.send('backend server is running!!!! :D');
});

// start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
