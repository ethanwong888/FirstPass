const express = require("express");
const app = express();
const http = require('http')
const bodyParser = require('body-parser')
const util = require('util')

const server = http.createServer(app)
const PORT = process.env.PORT|| 5000;

const fs = require('fs');
var allClasses = null;
var percent_filled = null; 


/* reading in the file for all the class names and the percent of seats full and convert them to JSON arrays */

const readFile = util.promisify(fs.readFile)

async function read(fileName) {
   return readFile(fileName)
   .then(res => {
    let data = JSON.parse(res);
 
    return data;
   })
   .catch(err => {
    throw err
   })
 };
 
async function run() {
 try {
 allClasses = await read('src/backend/JSON_Data/class_names.json')
 percent_filled = await read('src/backend/JSON_Data/pct_data.json');
 } catch (err) {
  throw err
 }
}

run()
.then(() => {
 
  /* filter the data so that only classes which contain dates with all full seats are in the array */ 
 for(let i = 0; i < percent_filled.length; i++)
 {
  percent_filled[i] = percent_filled[i].filter((obj)=> obj.y === 100);
 }

 console.log(percent_filled[1][0].x);

})


app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get("/",function(req,res)
{
 res.send("Server");
})

app.get("/classesData",function(req,res)
{
 const classes = req.body.classes;
 let dates = [];

 for(const c in classes)
 {
   const index = allClasses.indexOf(c);
   const date = percent_filled[index][0].x;
   dates.push(date);
 }

 res.status(200).send(dates);

})

server.listen(PORT, () => {
 console.log(`App running on port ${PORT}.`)
})
