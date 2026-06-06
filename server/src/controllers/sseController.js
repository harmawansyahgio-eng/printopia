const sseService = require('../services/sseService');

const connectSSE = (req, res) => {
  // Set headers for SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  // Tell client connection is successful
  res.write(`data: ${JSON.stringify({ type: 'connected', message: 'SSE connection established' })}\n\n`);

  const userId = req.user.id;
  const role = req.user.role;

  sseService.addClient(req, res, userId, role);
};

module.exports = {
  connectSSE
};
