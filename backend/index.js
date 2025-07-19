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
