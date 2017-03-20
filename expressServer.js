const express = require('express');
const fs = require('fs');
const path = require('path');
const port = (process.env.PORT || 8000);
const petsPath = path.join(__dirname, 'pets.JSON');
const url = require('url');


let app = express();
app.disable('x-powered-by');

fs.readFile(petsPath, 'utf8', (err, petsData) => {
  let parsedPets = JSON.parse(petsData);
  //READ
  app.get('/pets', (req, res) => {
    res.send(parsedPets);
  })
  app.get('/pets/:id', (req, res) => {
    let id = req.params.id;
    if (!isNaN(id) && id >= 0 && id < parsedPets.length) {
      res.send(parsedPets[id]);
    } else {
      res.set('Content-Type', 'text/plain');
      res.sendStatus(404);
    }
  })
  //CREATE
  app.post('/pets', (req, res) => {
    req.on('data', (data) => {
      let newPet = JSON.parse(data.toString());
      if (newPet.age && newPet.kind && newPet.name) {
        parsedPets.push(newPet);
        fs.writeFile(petsPath, JSON.stringify(parsedPets), (writeErr) => {
          if (writeErr) throw writeErr;
          res.send(newPet);
        })
      } else {
        res.sendStatus(400);
      }
    })
  })
  app.get('/', (req, res) => {
    res.sendStatus(404);
  })
  app.get('/:whatever', (req, res) => {
    let whatever = req.params.whatever;
    if (whatever !== "pets") {
      res.sendStatus(404);
    }
  })
})



// app.listen(8000);

module.exports = app;
