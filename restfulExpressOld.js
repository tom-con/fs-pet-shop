const express = require('express');
const fs = require('fs');
const path = require('path');
const port = (process.env.PORT || 8000);
const petsPath = path.join(__dirname, 'pets.JSON');
const url = require('url');
const bodyParser = require('body-parser');
const logger = require('morgan');


let app = express();
app.disable('x-powered-by');
app.use(bodyParser());


fs.readFile(petsPath, 'utf8', (err, petsData) => {
  let parsedPets = JSON.parse(petsData);

  // READ
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

  // CREATE
  app.post('/pets', (req, res) => {
    let newPet = req.body;
    if (newPet.age && !isNaN(newPet.age) && newPet.kind && newPet.name) {
      parsedPets.push(newPet);
      fs.writeFile(petsPath, JSON.stringify(parsedPets), (writeErr) => {
        if (writeErr) throw writeErr;
        res.send(newPet);
      })
    } else {
      res.set('Content-Type', 'text/plain');
      res.sendStatus(400);
    }

  })

  // UPDATE
  app.patch('/pets/:id', (req, res) => {
    // fs.readFile('pets.json', 'utf8', (err, petsData) => {
    //     let parsedPets = JSON.parse(petsData);
    let updateObj = req.body;
    let id = req.params.id;
    if ((updateObj.age && !isNaN(updateObj.age)) || updateObj.name || updateObj.kind) {
      if (parsedPets[id]) {
        for (let prop in updateObj) {
          if (prop === "age") updateObj[prop] = parseInt(updateObj[prop]);
          parsedPets[id][prop] = updateObj[prop];
        }
        fs.writeFile(petsPath, JSON.stringify(parsedPets), (writeErr) => {
          if (writeErr) throw writeErr;
          res.send(parsedPets[id])
        })
      } else {
        res.set('Content-Type', 'text/plain');
        res.sendStatus(404);
      }
    } else {
      res.set('Content-Type', 'text/plain');
      res.sendStatus(400);
    }
    // })
  })

  app.delete('/pets/:id', (req, res) => {
    let id = req.params.id;
    if (parsedPets[id]) {
      let pet = parsedPets[id];
      parsedPets = parsedPets.splice(id, 1);
      fs.writeFile(petsPath, parsedPets, (writeErr) => {
        if (writeErr) throw writeErr;
        console.log(parsedPets);
        res.send(pet)
      })
    } else {
      res.set('Content-Type', 'text/plain');
      res.sendStatus(404);
    }
  })

  // ERRORS
  app.get('/', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.sendStatus(404);
  })
  app.get('/:whatever', (req, res) => {
    let whatever = req.params.whatever;
    if (whatever !== "pets") {
      res.set('Content-Type', 'text/plain');
      res.sendStatus(404);
    }
  })
})

// app.listen(8000);

module.exports = app;
