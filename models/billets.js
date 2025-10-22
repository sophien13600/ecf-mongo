import { model, Schema } from "mongoose";

const billetSchema = new Schema({
    volId:{type: Schema.Types.ObjectId, ref: "Vol", require: true},
    passager:{type: Schema.Types.ObjectId, ref: "Passager", require: true},
    numeroSiege: {type: String, require: true},
    classe: {type: String, require: true,enum: ["Economie", ,"Affaires","Première"], default:"Economie"},
    prix: {type: Number,  require: true},  
    dateReservation: {type: Date, default: Date.now},
    modePaiement: {type: String, enum: ["CB", "Paypal","Especes"]},           
    statut: {type: String, enum:["confirmé", "annulé"], default: "confirmé"}                  
});

export default model("Billet", billetSchema);