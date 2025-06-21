const express = require('express');
const cors = require('cors');
const sequelize = require('./database');
const Produto = require('./models/produto');
const produtosRoutes = require('./routes/produtos');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/produtos', produtosRoutes);

const PORT = 3001;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
});
