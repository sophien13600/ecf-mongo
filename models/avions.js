import { model, Schema } from "mongoose";

const avionSchema = new Schema({
    modele: {type: String, require: true},
    compagnie: {type: String, require: true},
    capacite: {type: Number, require: true, max: 10},
    placesRestantes: {type: Number,  require: true, min:0, default: function () {
      return this.capacite; 
    }},  
    enService: {type: Boolean, default:true}
});

export default model("Avion", avionSchema);