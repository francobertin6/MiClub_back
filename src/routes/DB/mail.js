import  express  from "express";
import { transport } from "../../../utils.js";

const mail = express.Router();
mail.use(express.json());


export class email {

    static async deletePremium(req,res){

        let { email } = req.body;

        console.log(email);

        await transport.sendMail({
            from: "administrador",
            to: email,
            subject: "tu producto ha sido eliminado",
            html:   `
                <div>
                    <h1> el producto ha sido eliminado </h1>
                </div>    
            `
        })
    }
}

mail.get("/recuperatePassport", async(req,res) => {

    let result = await transport.sendMail({
        from: 'prueba de mail francobertin6@gmail.com',
        to: "francobertin6@gmail.com",
        subject:'correo de prueba',
        html:`
            <div>
                <h1>Esto es una prueba</h1>
            </div>`
    })

    console.log(result)
});

mail.get("/deletePremiumProduct", async(req,res) => {

    let { email } = req.body;

    let result = await transport.sendMail({
        from: "administrador",
        to: email,
        subject: "tu producto ha sido eliminado",
        html:`
            <div>
                <h1> el producto ha sido eliminado </h1>
            </div>    
        `
    })
});


export default mail;
