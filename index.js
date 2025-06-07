const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // <-- serve arquivos estáticos da pasta public

mongoose.connect('mongodb://localhost:27017/bancoDeQuestoes')
  .then(() => console.log("MongoDB conectado!"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

const questaoSchema = new mongoose.Schema({
  disciplina: String,
  tipo: String,
  enunciado: String,
  alternativas: [String],
  respostaCorreta: Number
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

app.listen(3000, '0.0.0.0', () => { // <- importante para aceitar conexões externas
  console.log("Servidor rodando na porta 3000");
});
