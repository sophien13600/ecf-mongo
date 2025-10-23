import { Router } from "express";
import Vol from "../models/vols.js";
import Avion from "../models/avions.js";
import Passager from "../models/passagers.js";
import Billet from "../models/billets.js";

const router = Router();

// Nombre de vols par statut
router.get("/stats/statuts/vols", async (req,res) =>{
    try {
        const statuts = await Vol.aggregate([
            { $match: { statut: { $in: ["prévu", "terminé", "retardé", "annulé"] } } },
            { $group: { _id: "$statut", total: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        res.json(statuts);
    } catch (error) {
        res.status(500).json({ erreur: error.message });
    }
})

// Répartition des vols par compagnie aérienne
router.get("/stats/statuts/vols-company", async (req,res) =>{
    try {
        const repartition = await Vol.aggregate([
            {
                $lookup: {
                    from: "avions",
                    localField: "avion",
                    foreignField: "_id",
                    as: "avion"
                }
            },
            { $unwind: "$avion" },
            { $group: { _id: "$avion.compagnie", totalVols: { $sum: 1 } } },
            { $sort: { totalVols: -1 } }
        ]);
        res.json(repartition);
    } catch (error) {
        res.status(500).json({ erreur: error.message });
    }
})

// Vols ayant lieu ce mois-ci
router.get("/stats/vols/mois-courant", async (req, res) => {
    try {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const total = await Vol.countDocuments({ dateDepart: { $gte: start, $lt: end } });
        res.json({ mois: now.getMonth() + 1, annee: now.getFullYear(), total });
    } catch (error) {
        res.status(500).json({ erreur: error.message });
    }
});

export default router;
// Additional stats endpoints for avions, passagers, billets, and dashboard

// Avions: en service vs hors service
router.get("/stats/avions/service", async (req, res) => {
    try {
        const agg = await Avion.aggregate([
            { $group: { _id: "$enService", total: { $sum: 1 } } }
        ]);
        const result = {
            enService: agg.find(a => a._id === true)?.total || 0,
            horsService: agg.find(a => a._id === false)?.total || 0
        };
        res.json(result);
    } catch (error) {
        res.status(500).json({ erreur: error.message });
    }
});

// Avions: capacité totale disponible dans la flotte (somme des capacités des avions en service)
router.get("/stats/avions/capacite-totale", async (req, res) => {
    try {
        const agg = await Avion.aggregate([
            { $match: { enService: true } },
            { $group: { _id: null, capaciteTotale: { $sum: "$capacite" }, placesDisponibles: { $sum: "$placesRestantes" } } }
        ]);
        const { capaciteTotale = 0, placesDisponibles = 0 } = agg[0] || {};
        res.json({ capaciteTotale, placesDisponibles });
    } catch (error) {
        res.status(500).json({ erreur: error.message });
    }
});

// Avions: compagnie avec le plus grand nombre d’avions
router.get("/stats/avions/top-compagnie", async (req, res) => {
    try {
        const top = await Avion.aggregate([
            { $group: { _id: "$compagnie", total: { $sum: 1 } } },
            { $sort: { total: -1 } },
            { $limit: 1 }
        ]);
        res.json(top[0] || { _id: null, total: 0 });
    } catch (error) {
        res.status(500).json({ erreur: error.message });
    }
});

// Passagers: total
router.get("/stats/passagers/total", async (req, res) => {
    try {
        const total = await Passager.countDocuments();
        res.json({ total });
    } catch (error) {
        res.status(500).json({ erreur: error.message });
    }
});

// Passagers: nouveaux ce mois-ci
router.get("/stats/passagers/nouveaux-mois", async (req, res) => {
    try {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const total = await Passager.countDocuments({ dateInscription: { $gte: start, $lt: end } });
        res.json({ mois: now.getMonth() + 1, annee: now.getFullYear(), total });
    } catch (error) {
        res.status(500).json({ erreur: error.message });
    }
});

// Billets: vendus ce mois (confirmés)
router.get("/stats/billets/vendus-mois", async (req, res) => {
    try {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const total = await Billet.countDocuments({ statut: "confirmé", dateReservation: { $gte: start, $lt: end } });
        res.json({ mois: now.getMonth() + 1, annee: now.getFullYear(), total });
    } catch (error) {
        res.status(500).json({ erreur: error.message });
    }
});

// Billets: revenu total (tous les confirmés)
router.get("/stats/billets/revenu-total", async (req, res) => {
    try {
        const agg = await Billet.aggregate([
            { $match: { statut: "confirmé" } },
            { $group: { _id: null, revenu: { $sum: "$prix" } } }
        ]);
        res.json({ revenu: (agg[0]?.revenu || 0) });
    } catch (error) {
        res.status(500).json({ erreur: error.message });
    }
});

// Billets: classe la plus vendue
router.get("/stats/billets/classe-top", async (req, res) => {
    try {
        const top = await Billet.aggregate([
            { $match: { statut: "confirmé" } },
            { $group: { _id: "$classe", total: { $sum: 1 } } },
            { $sort: { total: -1 } },
            { $limit: 1 }
        ]);
        res.json(top[0] || { _id: null, total: 0 });
    } catch (error) {
        res.status(500).json({ erreur: error.message });
    }
});

// Billets: nombre annulés
router.get("/stats/billets/annules", async (req, res) => {
    try {
        const total = await Billet.countDocuments({ statut: "annulé" });
        res.json({ total });
    } catch (error) {
        res.status(500).json({ erreur: error.message });
    }
});

// Dashboard (page principale)
router.get("/dashboard", async (req, res) => {
    try {
        // Vols actifs: en cours d’exploitation (on considère statut "prévu" ou "retardé" comme actifs)
        const volsActifsAgg = await Vol.aggregate([
            { $match: { statut: { $in: ["prévu", "retardé"] } } },
            { $count: "total" }
        ]);
        const volsActifs = volsActifsAgg[0]?.total || 0;

        // Avions en service
        const avionsService = await Avion.countDocuments({ enService: true });

        // Total passagers
        const totalPassagers = await Passager.countDocuments();

        // Total billets vendus (confirmés)
        const billetsVendus = await Billet.countDocuments({ statut: "confirmé" });

        // Revenu total (confirmés)
        const revenuAgg = await Billet.aggregate([
            { $match: { statut: "confirmé" } },
            { $group: { _id: null, revenu: { $sum: "$prix" } } }
        ]);
        const revenuTotal = revenuAgg[0]?.revenu || 0;

        // Taux d’annulation global
        const totalBillets = await Billet.countDocuments();
        const billetsAnnules = await Billet.countDocuments({ statut: "annulé" });
        const tauxAnnulation = totalBillets > 0 ? (billetsAnnules / totalBillets) * 100 : 0;

        res.render("dashboard", {
            kpis: {
                volsActifs,
                avionsService,
                totalPassagers,
                billetsVendus,
                revenuTotal,
                tauxAnnulation: Number(tauxAnnulation.toFixed(2))
            }
        });
    } catch (error) {
        res.status(500).send("Erreur lors du calcul du tableau de bord");
    }
});