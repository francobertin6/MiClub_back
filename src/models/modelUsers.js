import mongoose from "mongoose";

const modelUsers = new mongoose.Schema({
    username: {type: String, unique: true},
    email: {type: String, unique: true},
    password: {type: String, unique: true},
    cart: {type: mongoose.Schema.Types.ObjectId, ref: "modeloCarrito"},
    typeUser: {type: String},
    documents: {type: [{type: mongoose.Schema({
        name: {type: String},
        reference: {type: String} 
    })}]},
    last_connection: {type: Date, require: true}
})

export default mongoose.model('modelousuario', modelUsers);