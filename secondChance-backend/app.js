/* jshint esversion: 8 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');

const connectToDatabase = require('./models/db');
const logger = require('./logger');

const app = express();
app.use(cors());

// Configuração do logger com Pino para todas as requisições
app.use(pinoHttp({ logger }));

const port = process.env.PORT || 3060;

// Conexão com o MongoDB
connectToDatabase().then(() => {
  logger.info('Connected to DB');
}).catch((e) => logger.error('Failed to connect to DB', e));

app.use(express.json());

// Importando rotas
const authRoutes = require('./routes/authRoutes');
const secondChanceItemsRoutes = require('./routes/secondChanceItemsRoutes');
const searchRoutes = require('./routes/searchRoutes');

// Configurando rotas
app.use('/api/auth', authRoutes);
app.use('/api/secondchance/items', secondChanceItemsRoutes);
app.use('/api/secondchance/search', searchRoutes);

// Manipulador de Erros Global
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).send('Internal Server Error');
});

app.get('/', (req, res) => {
  res.send('Inside the server');
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
