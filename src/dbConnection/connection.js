const mongoose = require('mongoose');


const password='SergioMongo'
const dbname='calendario'
const uri= `mongodb+srv://Sergioglz:${password}@cluster0.p2ybn.mongodb.net/${dbname}?retryWrites=true&w=majority`

module.exports= () => mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology:true})