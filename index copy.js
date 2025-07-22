const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

require('dotenv').config();
console.log("URL do NGROK:", process.env.NGROK_URL);

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve arquivos estáticos da pasta public

mongoose.connect('mongodb://localhost:27017/bancoDeQuestoes')
  .then(() => console.log("MongoDB conectado!"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Agora o schema aceita também os campos 'assunto' e 'banca'
const questaoSchema = new mongoose.Schema({
  disciplina: String,
  assunto: String,           // <--- Adicionado
  banca: String,             // <--- Adicionado
  tipo: String,
  enunciado: String,
  alternativas: [String],
  respostaCorreta: Number,
  itens: [String]
});

const Questao = mongoose.model('Questao', questaoSchema, 'sistemaQuestoes');

app.post('/questoes', async (req, res) => {
  try {
    const novaQuestao = new Questao(req.body);
    await novaQuestao.save();
    res.status(201).send({ message: "Questão salva com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Erro ao salvar a questão." });
  }
});

app.get('/config', (req, res) => {
  res.json({
    serverUrl: process.env.SERVER_URL || 'http://localhost:3000'
  });
});

// Filtrar por disciplina
app.get('/questoes/:disciplina', async (req, res) => {
  try {
    const { disciplina } = req.params;
    const { assunto } = req.query;

    const filtro = { disciplina };
    if (assunto) filtro.assunto = assunto;

    const questoes = await Questao.find(filtro);
    res.status(200).json(questoes);
  } catch (error) {
    console.error("Erro ao buscar questões:", error);
    res.status(500).json({ message: "Erro ao buscar questões." });
  }
});


// Rota para buscar todas as disciplinas disponíveis com questões cadastradas
app.get('/disciplinas', async (req, res) => {
  try {
    const disciplinas = await Questao.distinct('disciplina');
    res.status(200).json(disciplinas);
  } catch (error) {
    console.error("Erro ao buscar disciplinas:", error);
    res.status(500).json({ message: "Erro ao buscar disciplinas." });
  }
});

app.listen(3000, 'localhost', () => {
  console.log("Servidor rodando na porta 3000");
});
