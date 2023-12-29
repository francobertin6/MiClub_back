import Stripe from "stripe";

export default class PaymentService{
    
    constructor () {
        this.stripe = new Stripe("francobertin") 
    }

    createPayment = async (data) => {

        const paymentIntent = this.stripe.paymentIntents.create(data);
        return paymentIntent
    }
}