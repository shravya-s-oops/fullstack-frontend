const express = require('express');
const router = express.Router();

// Dummy data for now
const childHealthData = [
  { name: 'John', age: 3 },
  { name: 'Asha', age: 5 },
  { name: 'Kiran', age: 2 }
];

// GET /api/child-health
router.get('/', (req, res) => {
  res.json(childHealthData);
});

module.exports = router;
