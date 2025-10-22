import { model, Schema } from "mongoose";

const volSchema = new Schema({
    numeroVol: {type: String, require: true},
    origine: {type: String, require: true},
    destination: {type: String, require: true},
    dateDepart: {type: Date,  require: true},  
    dateArrivee: {type: Date, require: true},
    avion:{type: Schema.Types.ObjectId, ref: "Avion", require:true},
    statut:{type: String, enum: ["prévu", "retardé", "terminé", "annulé"], default:"prévu",require: true,}
});

export default model("Vol", volSchema);