import mongoose from "mongoose";

const modelCourts = new mongoose.Schema({
    title : { type : String , require : true },
    description : { type : String },
    price : { type : Number , require : true},
    Thumbnail : { type: [{type: mongoose.Schema({
        name: {type: String, require: true}
    })}]},
    owner : {type: String, require: true},
    type : {type: String, require : true},
    courts : { type: [{type: mongoose.Schema({
        name: {type: String},
        schedule: {type: Array},
        surface : {type: String},
        status: {type: Boolean}
    })}]}
}, {timestamps: true});

export default mongoose.model('modeloCanchas', modelCourts);