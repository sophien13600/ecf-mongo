import express from "express";
import { connect } from "mongoose";

const app = express();
app.use(express.json());


// connexion à mongoDB
connect("mongodb://localhost:27017/ecf")
.then(() => console.log("connecté à mongoDB OK"))
.catch(() => console.log("connecté à mongoDB KO"));


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => console.log(`serveur lancé sur le port http://localhost:3000`) );