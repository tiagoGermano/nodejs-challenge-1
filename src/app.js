const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid, validate } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const repository = {
    id : uuid(),
    title,
    url,
    techs,
    likes : 0
  }
  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  if(!validate(id)){
    return response.status(400).send('invalid repository id');
  }

  const repository = repositories.find(repository => repository.id === id );

  if(repository === undefined){
    return response.status(404).send(`repository id: ${id} not found`);
  }

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  if(!validate(id)){
    return response.status(400).send('invalid repository id');
  }

  const repositoryIndex = repositories.findIndex(repository => repository.id === id );

  if(repositoryIndex === -1){
    return response.status(404).send(`repository id: ${id} not found`);
  }

  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  if(!validate(id)){
    return response.status(400).send('invalid repository id');
  }

  const repository = repositories.find(repository => repository.id === id );

  if(repository === undefined){
    return response.status(404).send(`repository id: ${id} not found`);
  }

  repository.likes = repository.likes +1;

  return response.json(repository);
});

module.exports = app;
