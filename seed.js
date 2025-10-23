import fs from 'fs';
import mongoose from 'mongoose';
import { connect } from "mongoose";
import Avion from './models/avions.js';
import Vol from './models/Vols.js';
import Passager from './models/Passagers.js';
import Billet from './models/Billets.js';

function convertExtendedJSON(obj) {
    if (Array.isArray(obj)) {
        return obj.map(convertExtendedJSON);
    } else if (obj && typeof obj === 'object') {
        if (obj.$oid) return new mongoose.Types.ObjectId(obj.$oid);
        if (obj.$date) return new Date(obj.$date);

        const newObj = {};
        for (const [k, v] of Object.entries(obj)) {
            newObj[k] = convertExtendedJSON(v);
        }
        return newObj;
    }
    return obj;
}

const dataRaw = JSON.parse(fs.readFileSync('./ecf_dataset.json', 'utf8'));
const data = convertExtendedJSON(dataRaw);

(async () => {
    await connect('mongodb://127.0.0.1:27017/ecf');
    await mongoose.connection.dropDatabase();

    await Avion.insertMany(data.avions);
    await Vol.insertMany(data.vols);
    await Passager.insertMany(data.passagers);
    await Billet.insertMany(data.billets);

    console.log('✅ Données importées avec succès');
    process.exit();
})();
