// "type": "commonjs"
// C’est la plus simple, la plus stable, et la plus utilisée avec Express
const express = require('express');
const app = express();
require('dotenv').config();
const userRoute= require('./routes/userRoute');
const authRoute = require('./routes/authRoute')
const PORT = process.env.PORT;
const cors= require ('cors')
const cookieParser = require('cookie-parser');
const mongoose= require('mongoose')

// MIDDLEWARES + ROUTES
// Ce middleware active le CORS (Cross-Origin Resource Sharing).
// En gros, il autorise ton backend à accepter des requêtes qui viennent d’autres domaines.
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:60398'],
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
//   permet d’envoyer les cookies, tokens, headers sécurisés entre front et back.
  credentials: true
}));

// Ce middleware dit à Express :
// “Si la requête contient un corps en JSON, lis-le et transforme-le en objet JavaScript.”
app.use(express.json());
// Celui-là permet à Express de lire les données envoyées depuis un formulaire HTML classique.
app.use(express.urlencoded({ extended: true }));
// Ce middleware permet à Express de lire les cookies envoyés par le navigateur.
app.use(cookieParser());

app.use('/user',userRoute);
app.use('/auth', authRoute);
 
// CONNEXION MongoDB
const connect = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/M1ISIDS");
    console.log("✅ MongoDB database connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};
connect();
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});