import express from "express";
import { connect } from "mongoose";
import avionsRoutes from "./routes/avionsRoutes.js";
import passagersRoutes from "./routes/passagersRoutes.js";
import volsRoutes from "./routes/volsRoutes.js";
import billetsRoutes from "./routes/billetsRoutes.js";

const app = express();
app.use(express.json());
app.use("/api",avionsRoutes)
app.use("/api",passagersRoutes)
app.use("/api",volsRoutes)
app.use("/api",billetsRoutes)



// connexion à mongoDB
connect("mongodb://localhost:27017/ecf")
.then(() => console.log("connecté à mongoDB OK"))
.catch(() => console.log("connecté à mongoDB KO"));


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => console.log(`serveur lancé sur le port http://localhost:3000`) );