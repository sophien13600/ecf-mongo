import { Router } from "express";
import Avion from "../models/avions.js";

const router = Router();

router.get("/avions", async (req, res) => {
    try{
        const avions = await Avion.find();
        // console.log(avions);
        res.render("index", {avions});
    }catch(err){

    }
});

router.get("/avions/new", async (req, res) => {
    try{
        res.render("addAvions");
    }catch(err){

    }
});

router.post('/api/avions', async (req, res) => {
    try{
        const avion = await Avion.create(req.body);
        res.status(201).json(avion);
    }catch(err){
        res.status(404).json({erreur: err.message});
    }
});
router.get('/api/avions', async (req, res) => {
    try{
        const avion = await Avion.find(req.body);
        res.status(201).json(avion);
    }catch(err){
        res.status(404).json({erreur: err.message});
    }
});
router.delete("/api/avions/:id", async (req, res) => {
    await Avion.findByIdAndDelete(req.params.id);
    res.redirect("/avions");
});
// Avions GET /api/avions Lister tous les avions 
// Avions POST /api/avions Créer un avion

export default router;