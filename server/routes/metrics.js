module.exports = (app, db) => {
  app.get('/api/metrics', async (req, res) => {
    try {
      // In production, fetch real metrics
      // For foundation, return mock data
      res.json({
        serverLoad: 45,
        activeConnections: 12,
        queueStatus: 'Healthy',
        recentErrors: 2,
        loadData: [
          { time: '00:00', load: 30 },
          { time: '04:00', load: 45 },
          { time: '08:00', load: 60 },
          { time: '12:00', load: 50 },
          { time: '16:00', load: 40 },
          { time: '20:00', load: 35 },
        ],
        queueData: [
          { name: 'Pending', value: 15 },
          { name: 'Processing', value: 8 },
          { name: 'Completed', value: 120 },
          { name: 'Failed', value: 2 },
        ]
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};
