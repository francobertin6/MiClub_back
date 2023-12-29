
import { Router } from "express";
import PaymentService from "../../services/payments";


const PaymentRoute = Router();

PaymentRoute.post("/Payment", async(req,res) => {

    let { body } = req.body;

    

})