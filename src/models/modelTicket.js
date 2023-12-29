import mongoose from "mongoose";

const modelTicket = new mongoose.Schema({
    code: { type: String, require: true},
    purchase_datetime: {type: Date, require: true},
    amount: {type: Number, require: true},
    purchaser: {type: String, require:true}
})