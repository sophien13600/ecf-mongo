import { Router } from "express";
import Vol from "../models/vols.js ";
import Billet from "../models/billets.js";

const router = Router();

router.post("/vols", async(req,res) =>{
    try {
        const vol = await Vol.create(req.body);
        res.status(201).json(vol)
        
    } catch (error) {
        res.status(404).json({erreur: err.message})
    }
})

router.get("/vols/:id", async(req,res) =>{
    try {
        const vol = await Vol.findById(req.params.id);
        res.status(201).json(vol)
        
    } catch (error) {
        res.status(404).json({erreur: err.message})
    }
})

router.delete("/vols/:id", async(req,res) =>{
    try {
        const billetExist = await Billet.exists({volId: req.params.id});
        if( billetExist ){
            res.status(201).json({"msg": "Impossible de supprimer ce vol"});
            
        }
        const deleteVol = await Vol.findByIdAndDelete(req.params.id);

        if( !deleteVol ) return res.status(404).json({"msg": "Ce train n'existe pas"});

    res.status(201).json({"msg": "Train supprimé"});
        
        return res.status(400).json({"error": "Aucun vol pour cet ID"})
    } catch (error) {
        res.status(400).json({erreur: error.message})
    }
});
export default router;