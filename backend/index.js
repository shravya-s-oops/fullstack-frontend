<<<<<<< HEAD
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Allow requests from frontend
app.use(cors());

// Default route
app.get('/', (req, res) => {
  res.send('Hello from Backend!');
});

app.listen(PORT, () => {
  console.log(`✅ Backend is running at http://localhost:${PORT}`);
});
=======
// backend/index.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is working!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

>>>>>>> 2083033c19c616e9067c750e464deefe3c33c64c
