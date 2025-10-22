import { model, Schema } from "mongoose";

const passagerSchema = new Schema({
    nom: {type:String, require:true}, 
    prenom: {type:String, require:true}, 
    email: {type: String, require:true,unique:true},  
    pays : {type: String, require:true}, 
    dateInscription:{type:Date, default:Date.now} 
});

export default model("Passager", passagerSchema);