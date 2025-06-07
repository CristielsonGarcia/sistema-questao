const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conectar ao banco MongoDB local
mongoose.connect('mongodb://localhost:27017/bancoDeQuestoes')
  .then(() => console.log("MongoDB conectado!"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Definição do schema (estrutura da questão)
const questaoSchema = new mongoose.Schema({
  disciplina: String,
  tipo: String,
  enunciado: String,
  alternativas: [String],
  respostaCorreta: Number
});

// Define explicitamente a collection como "sistemaQuestoes"
const Questao = mongoose.model('Questao', questaoSchema, 'sistemaQuestoes');

// Rota para salvar as questões no banco
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

// Rota GET para buscar questões por disciplina
app.get('/questoes/:disciplina', async (req, res) => {
  try {
    const { disciplina } = req.params;
    const questoes = await Questao.find({ disciplina });
    res.status(200).json(questoes);
  } catch (error) {
    console.error("Erro ao buscar questões:", error);
    res.status(500).json({ message: "Erro ao buscar questões." });
  }
});

// Iniciar servidor
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
