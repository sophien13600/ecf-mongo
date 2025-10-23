import { Router } from "express";
import Passager from "../models/passagers.js";

const router = Router();

router.post("/api/passagers", async(req,res) =>{
    try {
        const passager = await Passager.create(req.body);
        res.status(201).json(passager);
        
    } catch (error) {
        res.status(400).json({erreur: error.message})        
    }
})

export default router;