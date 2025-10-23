import { Router } from "express";
import Vol from "../models/vols.js ";

const router =Router()


router.get("/stats/statuts/vols", async (req,res) =>{
    const statut = await Vol.aggregate([
      { $match: { statut: { $in: ["prévu", "terminé", "retardé"] } } },
      { $group: { _id: "$statut", total: { $sum: 1 } } }
    ]);
res.send(statut)
})

router.get("/stats/statuts/vols-company", async (req,res) =>{
    const repartition = await Vol.aggregate([
    {$lookup:
        {
        from: "avions" ,
        localfield: "avion",
        foreignfield: "compagnie",
        as : "compag "
        
        }
    }
    ]);
res.send(statut)
})





// Gestion des vols 
// • Combien de vols sont prévu, retardé, terminé ou annulé ? 
// • Quelle est la répartition des vols par compagnie aérienne ? 
// • Combien de vols ont lieu ce mois ? 


export default router