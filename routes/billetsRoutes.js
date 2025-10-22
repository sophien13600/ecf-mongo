import { Router } from "express";
import Billet from "../models/billets.js";
import Vol from "../models/vols.js";
import Avion from "../models/avions.js";

const router = Router();

router.post("api/billets", async(req,res) =>{
   
    try {
        const vol = await Vol.findById(req.body.vol).populate('avion');
        const avion = vol.avion
        console.log(avion);
        
        if(!vol){
            res.status(400).json({"error": "Aucun vol pour cet ID"})
        }

        if(vol && avion.placesRestantes ==0 ){
            throw new Error("Plus de places disponibles sur ce vol.");
            

        } else {
            const billet = await Billet.create(req.body);
            avion.placesRestantes -= 1;
            await avion.save();
            res.status(201).json(billet)
    }
        
    } catch (error) {
        res.status(400).json({erreur: error.message})
    }
});
router.delete("api/billets/:id", async (req, res) => {
    try {
        const billet = await Billet.findByIdAndDelete(req.params.id);
        if (!billet) {
            return res.status(404).json({ msg: "Billet introuvable" });
        }
        //console.log("Billet trouvé:", billet);
        
        const vol = await Vol.findById(billet.vol);
        if (!vol) {
            return res.status(404).json({ msg: "Vol introuvable" });
        }
        //console.log("ID du vol du billet:", billet.vol);
        //console.log("Vol trouvé:", vol);
        
        const avion = await Avion.findById(vol.avion);
        if (!avion) {
            return res.status(404).json({ msg: "Avion introuvable" });
        }

    avion.placesRestantes += 1;
    await avion.save();

    return res.status(200).json({ msg: "Billet supprimé et place rétablie", billet });
  } catch (error) {
    return res.status(500).json({ erreur: error.message });
  }
});

export default router;