import { Router } from "express";
import Vol from "../models/vols.js ";
import Avion from "../models/avions.js"
import Billet from "../models/billets.js";

const router = Router();

router.post("/api/vols", async(req,res) =>{
    // try {
    //     const vol = await Vol.create(req.body);
    //     res.status(201).json(vol)
        
    // } catch (error) {
    //     res.status(404).json({erreur: err.message})
    // }
    try{
        
        const {avion: avionId} = req.body;
        const avion = await Avion.findById(avionId);

        const volData = {
            ...req.body,
            placesRestantes: avion.capacite
        }

        await Vol.create(volData);
        res.redirect("/vols");
    }catch(err){

    }
})

router.get("api/vols/:id", async(req,res) =>{
    try {
        const vol = await Vol.findById(req.params.id);
        res.status(201).json(vol)
        
    } catch (error) {
        res.status(404).json({erreur: err.message})
    }
})

router.get("/vols/new", async(req,res) =>{
    const avions = await Avion.find(req.body);
    res.render("addVols", {avions})
})
router.get("/vols", async (req, res) => {
        console.log("vols");
    try{
        const vols = await Vol.find().populate("avion");
       // console.log(vols);
       const statuts = await Vol.aggregate([
      { $match: { statut: { $in: ["prévu", "terminé", "retardé"] } } },
      { $group: { _id: "$statut", total: { $sum: 1 } } }
    ]);
//res.send(statuts) 
        res.render("vols", {vols, statuts});
    }catch(err){
 
    }
});

router.delete("api/vols/:id", async(req,res) =>{
    try {
        const billetExist = await Billet.exists({vol: req.params.id});
        if( billetExist ){
           return res.status(400).json({"msg": "Impossible de supprimer ce vol: des billets existent"});
            
        }
        const deleteVol = await Vol.findByIdAndDelete(req.params.id);

        if( !deleteVol ) return res.status(404).json({"msg": "Ce vol n'existe pas"});
        res.status(201).json({"msg": "Vol supprimé avec succès"});
        

        
    } catch (error) {
        res.status(400).json({erreur: error.message})
    }
});
export default router;