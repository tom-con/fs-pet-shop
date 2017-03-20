



const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.JSON');
let args = process.argv;
let subCommand = args[2];

//checks to see if the terminal command has "read" as the third part of it ($node pets.js read)

if(!args[2]){
  console.error("Usage: node pets.js [read | create | update | destroy]");
  process.exit(1);
}

fs.readFile(petsPath, 'utf8', (err, petsData) => {
      let parsedPets = JSON.parse(petsData);
  if (subCommand === 'read') {
    if (args.length === 3) {
      console.log(parsedPets);
    }
    //checks to see if args[3] exists, then checks to make sure args[3] is greater than 0, then checks to see if args[3] is less than the length of petsData

    else if (args[3] && (args[3] >= 0) && (args[3] < parsedPets.length)) {
      console.log(parsedPets[args[3]]);
    }

  }
})


// console.log(process.argv[2]);
//
// process.exit(1);
