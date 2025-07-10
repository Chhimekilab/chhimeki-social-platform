const express = require('express');
const router = express.Router();

// Mock auth routes for now
router.post('/login', (req, res) => {
  res.json({ success: true, message: 'Login endpoint' });
});

router.post('/register', (req, res) => {
  res.json({ success: true, message: 'Register endpoint' });
});

router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logout endpoint' });
});

module.exports = router;