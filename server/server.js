const express = require('express');
const cors = require('cors');
const env = require('./src/config/env');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./src/routes/authRoutes');
const documentRoutes = require('./src/routes/documentRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const sseRoutes = require('./src/routes/sseRoutes');
const settingsRoutes = require('./src/routes/settingsRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/sse', sseRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/', (req, res) => {
  res.send('Printopia API is running');
});

// Use error handler middleware as the last middleware
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server is running on http://localhost:${env.port}`);
});
