import { model, Schema } from "mongoose";

const avionSchema = new Schema({
    modele: {type: String, required: true},
    compagnie: {type: String, required: true},
    capacite: {type: Number, required: true, max: 10},
    placesRestantes: {type: Number, min:0, default: function () {
      return this.capacite; 
    }},  
    enService: {type: Boolean, default:true}
});

export default model("Avion", avionSchema);