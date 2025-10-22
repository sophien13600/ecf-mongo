import { Router } from "express";
import Billet from "../models/billets.js";
import Vol from "../models/vols.js";
//import Avion from "../models/avions.js";


const router = Router();

router.post("/billets", async(req,res) =>{
   
    try {
        const vol = await Vol.findById(req.body.volId).populate('avion');
        const avion = vol.avion
        console.log(avion);
        
        if(!vol){
            res.status(400).json({"error": "Aucun vol pour cet ID"})
        }

        if(vol && avion.placeRestante ==0 ){
            throw new Error("Plus de places disponibles sur ce vol.");
            

        } else {
            const billet = await Billet.create(req.body);
            avion.placeRestante -= 1;
            await avion.save();
            res.status(201).json(billet)
    }
        
    } catch (error) {
        res.status(400).json({erreur: error.message})
    }
});
router.delete("/billets/:id", async(req,res) =>{
    try {
        const billet = await Billet.findByIdAndDelete(req.params.id);
         //avion.placeRestante += 1;
        res.status(200).json(billet);
    } catch (error) {
        res.status(400).json({erreur: err.message})
        
    }
});





export default router;