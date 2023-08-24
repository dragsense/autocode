import express from 'express';

const router = express.Router();

router.get('/api/route1', (req, res) => {
  // Handle the GET request for /api/route1
  res.json({ message: 'Route 1' });
});

router.post('/api/route2', (req, res) => {
  // Handle the POST request for /api/route2
  res.json({ message: 'Route 2' });
});

export default router;