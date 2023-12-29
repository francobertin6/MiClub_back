import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config();

export const  init = async () => {

    try{

        await mongoose.connect("mongodb+srv://francobertin6:123456789bertinF@cluster0.xyxwpdo.mongodb.net/ecommerce?retryWrites=true&w=majority");
        console.log("database esta conectado");
    
    }catch(error){

        console.log(error);

    }
    
} 