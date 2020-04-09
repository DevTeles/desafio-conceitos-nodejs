const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests(req, res, next) {
  const { method, url } = req;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel);

  return next();
}

function validateRepositorioId(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: 'Invalid repository ID.' });
  }
  return next();
}

app.use(logRequests);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {  
  const { title, url, techs } = request.body;

  const repo = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repo);
  
  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repoIndex = repositories.findIndex(f => f.id === id);

  if (repoIndex < 0) {
    response.status(400).json({ error: 'Repositório não encontrado!' });
  }

  const repoEdit = repositories[repoIndex];
  
  repoEdit.title = title;
  repoEdit.url = url;
  repoEdit.techs = techs;

  repositories[repoIndex] = repoEdit;

  return response.json(repositories[repoIndex]);
});

app.delete("/repositories/:id", validateRepositorioId, (req, res) => {
  const { id } = req.params;
  
  const repoIndex = repositories.findIndex(f => f.id === id);  

  repositories.splice(repoIndex, 1);

  return res.send();
});

app.post("/repositories/:id/like", validateRepositorioId, (request, response) => {  
  const { id } = request.params;

  const repoIndex = repositories.findIndex(f => f.id === id);

  repositories[repoIndex].likes += 1;

  return response.json({ likes: repositories[repoIndex].likes });
});

module.exports = app;
