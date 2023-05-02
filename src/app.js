const express = require("express");

const app = express();
const path = require("path");
const cors = require('cors');

app.use(express.json())
app.use(express.urlencoded({ extended: false }));

const corsOptions = {
   origin: 'https://cukfit.netlify.app',
   origin: "http://localhost:3000",
   origin: "http://localhost:3001",
 };
 
 app.use(cors(corsOptions));

app.use((req, res, next) => {

    // Dominio que tengan acceso (ej. 'http://example.com')
       res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Metodos de solicitud que deseas permitir
       res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    
    // Encabecedados que permites (ej. 'X-Requested-With,content-type')
       res.setHeader('Access-Control-Allow-Headers', '*');
    
    next();
    })
    

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(require("./routes/index.routes"));


app.listen(9000, () => console.log("Servidor a la espera de conexiones"));
