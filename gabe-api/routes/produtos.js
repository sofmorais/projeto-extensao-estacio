const express = require('express');
const router = express.Router();
const Produto = require('../models/produto');
const Log = require('../models/log'); 

// Função auxiliar para criar log
async function criarLog(produto, acao) {
  await Log.create({
    data: new Date().toLocaleString(),
    produto,
    acao,
  });
}

// Listar todos os produtos
router.get('/', async (req, res) => {
  const produtos = await Produto.findAll();
  res.json(produtos);
});

// Criar um novo produto
router.post('/', async (req, res) => {
  const { nome, qtd } = req.body;
  if (!nome || qtd == null) {
    return res.status(400).json({ erro: 'Nome e quantidade são obrigatórios' });
  }

  const novo = await Produto.create({ nome, qtd });
  await criarLog(nome, 'Adicionado');
  res.status(201).json(novo);
});

// Atualizar produto (nome e/ou quantidade)
router.put('/:id', async (req, res) => {
  const { nome, qtd } = req.body;

  const produto = await Produto.findByPk(req.params.id);
  if (!produto) return res.status(404).send();

  let mudou = false;
  let acoes = [];

  if (nome !== undefined && nome !== produto.nome) {
    produto.nome = nome;
    mudou = true;
    acoes.push('Nome atualizado');
  }

  if (qtd !== undefined && qtd !== null && qtd !== produto.qtd) {
    produto.qtd = Number.isInteger(qtd) && qtd >= 0 ? qtd : 0;
    mudou = true;
    acoes.push('Quantidade atualizada');
  }

  if (mudou) {
    await produto.save();
    for (const acao of acoes) {
      await criarLog(produto.nome, acao);
    }
  }

  res.json(produto);
});

// Remover quantidade de um produto
router.put('/:id/remover', async (req, res) => {
  const removerQtd = parseInt(req.body.qtd);

  if (!removerQtd || removerQtd <= 0) {
    return res.status(400).json({ erro: 'Quantidade inválida para remoção' });
  }

  const produto = await Produto.findByPk(req.params.id);
  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  produto.qtd = Math.max(produto.qtd - removerQtd, 0);
  await produto.save();

  await criarLog(produto.nome, `Removido ${removerQtd}`);

  res.json(produto);
});

// Excluir completamente um produto
router.delete('/:id', async (req, res) => {
  const produto = await Produto.findByPk(req.params.id);
  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  const nome = produto.nome;

  await produto.destroy();

  await criarLog(nome, 'Excluído');

  res.status(204).send();
});

router.get('/logs', async (req, res) => {
  const logs = await Log.findAll({ order: [['createdAt', 'DESC']] });
  res.json(logs);
});


module.exports = router;
