const mongoose = require('mongoose');

const password='SergioMongo'
const dbname2='fitRecipes'
const uri2= `mongodb+srv://Sergioglz:${password}@cluster0.p2ybn.mongodb.net/${dbname2}?retryWrites=true&w=majority`
module.exports= () => mongoose.connect(uri2, {useNewUrlParser: true, useUnifiedTopology:true})