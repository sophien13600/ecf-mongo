import { model, Schema } from "mongoose";

const billetSchema = new Schema({
    vol:{type: Schema.Types.ObjectId, ref: "Vol", required: true},
    passager:{type: Schema.Types.ObjectId, ref: "Passager", require: true},
    numeroSiege: {type: String, required: true},
    classe: {type: String, required: true,enum: ["Economie", ,"Affaires","Première"], default:"Economie"},
    prix: {type: Number,  required: true},  
    dateReservation: {type: Date, default: Date.now},
    modePaiement: {type: String, enum: ["CB", "Paypal","Especes"]},           
    statut: {type: String, enum:["confirmé", "annulé"], default: "confirmé"}                  
});

export default model("Billet", billetSchema);