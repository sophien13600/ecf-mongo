import { Router } from "express";
import Avion from "../models/avions.js";

const router = Router();

router.post('/avions', async (req, res) => {
    try{
        const avion = await Avion.create(req.body);
        res.status(201).json(avion);
    }catch(err){
        res.status(404).json({erreur: err.message});
    }
});
router.get('/avions', async (req, res) => {
    try{
        const avion = await Avion.find(req.body);
        res.status(201).json(avion);
    }catch(err){
        res.status(404).json({erreur: err.message});
    }
});
// Avions GET /api/avions Lister tous les avions 
// Avions POST /api/avions Créer un avion

export default router;