const express = require("express");

const app = express();
const path = require("path");
const cors = require('cors');

app.use(express.json())
app.use(express.urlencoded({ extended: false }));

const allowedOrigins = [
   'https://cukfit.netlify.app',
   'http://localhost:3000'
 ];
 
 const corsOptions = {
   origin: allowedOrigins
 };
 
 app.use(cors(corsOptions));

app.use((req, res, next) => {

       res.setHeader('Access-Control-Allow-Origin', '*');
    
       res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    
       res.setHeader('Access-Control-Allow-Headers', '*');
    
    next();
    })
    

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(require("./routes/index.routes"));


app.listen(9000, () => console.log("Servidor a la espera de conexiones"));
