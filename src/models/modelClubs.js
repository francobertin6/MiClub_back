import mongoose from "mongoose";

const modelClubs = new mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref:"modelousuarios"},
    name: {type: String, require: true},
    profilePicture: {type: String},
    news: {type: [{type: mongoose.Schema({
            title: {type: String, require:true},
            text: {type: String, require:true},
            date: {type: Date, require:true},
            tag: {type: String, require:true}
    })}]},
    courts: {type: [{type: mongoose.Schema({
        id: {type: mongoose.Schema.Types.ObjectId, ref:"modeloProducto"}
    })}]},
    profile: {type: mongoose.Schema({
        phone: {type: Number},
        city: {type: String},
        adress: {type: String}
    })}
})

export default mongoose.model('modeloClubes', modelClubs);