//RECEITA DE BOLINHO DE CHUVA COM BANANA

const express = require("express");
const { v4: uuidV4 } = require("uuid");

const app = express();
const port = 3000;

app.use(express.json());
app.use((req, res, next) => {
  next();
});

const clientes = [];

app.get("/buscar_todos", (req, res) => {
  res.json({
    dados: clientes,
    totalRegistros: clientes.length,
  });
});

app.get("/buscar/:email", (req, res) => {
  const { email } = req.params;
  const index = checkIsEmailExists(email);
  if (index === -1) {
    res.status(404).json({
      mensagem: "Cliente não encontrado!",
    });
  } else {
    res.json({
      dados: clientes[index],
    });
  }
});

app.post("/cadastrar", (req, res) => {
  const dados = req.body;

  if (checkIsEmailExists(dados.email) !== -1) {
    return res.status(400).json({
      mensagem: "Email já cadastrado",
    });
  }

  clientes.push({
    id: uuidV4(),
    ...dados,
  });

  res.json({
    mensagem: "Cliente cadastrado com sucesso!",
  });

  return res.sendStatus(200);
});

app.put("/atualizar/:id", (req, res) => {
  const { id } = req.params;

  const dados = req.body;

  const isExists = clientes.findIndex((el) => el.id === id);

  if (isExists === -1) {
    return res.status(400).json({
      mensagem: "Cliente não encontrado",
    });
  }

  clientes[isExists] = {
    id,
    ...dados,
  };

  return res.sendStatus(200);
});

app.delete("/deletar/:id", (req, res) => {
  const { id } = req.params;

  const isExists = clientes.findIndex((el) => el.id === id);

  if (isExists === -1) {
    return res.status(400).json({
      mensagem: "Cliente não encontrado",
    });
  }

  clientes.splice(isExists, 1);

  return res.sendStatus(200);
});

function checkIsEmailExists(email) {
  return clientes.findIndex((el) => el.email === email);
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
