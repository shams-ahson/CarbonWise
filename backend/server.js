const {router: authRoutes} = require('./routes/auth');
const quizRoutes = require('./routes/quiz_route');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));


app.use('/api/auth', authRoutes);
app.use('/api', quizRoutes);

// verify server is running
app.get('/', (req, res) => {
  res.send('backend server is running!!!! :D');
});

// start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
