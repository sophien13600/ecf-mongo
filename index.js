import cors from "cors";
import methodeoverride from "method-override";
import express from "express";
import { connect } from "mongoose";
import avionsRoutes from "./routes/avionsRoutes.js";
import passagersRoutes from "./routes/passagersRoutes.js";
import volsRoutes from "./routes/volsRoutes.js";
import billetsRoutes from "./routes/billetsRoutes.js";
import statsRoutes from "./routes/statsRoute.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(methodeoverride("_method"));


app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/",avionsRoutes)
app.use("/",passagersRoutes)
app.use("/",volsRoutes)
app.use("/",billetsRoutes)
app.use("/",statsRoutes)


// connexion à mongoDB
connect("mongodb://localhost:27017/ecf")
.then(() => console.log("connecté à mongoDB OK"))
.catch(() => console.log("connecté à mongoDB KO"));


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => console.log(`serveur lancé sur le port http://localhost:3000`) );