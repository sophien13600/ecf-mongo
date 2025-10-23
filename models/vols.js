import { model, Schema } from "mongoose";

const volSchema = new Schema({
    numeroVol: {type: String, required: true},
    origine: {type: String, required: true},
    destination: {type: String, required: true},
    dateDepart: {type: Date,  required: true},  
    dateArrivee: {type: Date, required: true},
    avion:{type: Schema.Types.ObjectId, ref: "Avion", required:true},
    statut:{type: String, enum: ["prévu", "retardé", "terminé", "annulé"], default:"prévu", required: true }
});

export default model("Vol", volSchema);