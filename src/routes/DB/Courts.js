import  express  from "express";
import _Dirname from "../../../utils.js";
import fs from "fs";

import { authToken, TypeUserCheck } from "../../../utils.js";
import modelCourts from "../../models/modelCourts.js";

import { uploader } from "../../../utils.js";
import { email } from "./mail.js";


const CourtsDB = express.Router();
CourtsDB.use(express.json());
CourtsDB.use(express.static(_Dirname + "/src/public"));


CourtsDB.post( "/Post_dbproduct", TypeUserCheck(), async (req, res) => {

    console.log(req.user);

        const {body} = req;

        if(req.user.typeUser === "premium"){

            body.owner = req.user.id;

        }else if(req.user.typeUser === "admin"){

            body.owner = "admin"

        }

        fs.mkdirSync((_Dirname + "/src/public/clubs/" + user.id + "/courts/" + body.title, { recursive: true }));
        
        const producto = {

            ...body

        }

        console.log(producto);

        const result = await modelCourts.create(producto);

        res.status(201).json(result)

});

CourtsDB.get("/Get_dbproduct", authToken('jwt'), async (req,res) => {

    const result = await modelCourts.find().lean();

    res.status(200).json(result);
});

CourtsDB.put( "/Put_dbproduct/:id", TypeUserCheck(), async (req,res) => {

    const { params : { id }, body} = req;

    let user = req.user;

    
    if(user.typeUser === "premium" && body.owner === user.id){

        await modelCourts.updateOne( {_id: id}, {$set: body});

        res.status(204).send("producto actualizado por el admin")

    }else if(user.typeUser === "admin"){

        await modelCourts.updateOne( {_id: id}, {$set: body});

        res.status(204).send("producto actualizado por el dueño del producto")

    }else if(user.typeUser === "premium" && body.owner !== user.id){

        res.status(404).send("el usuario no puede modificar un producto que no es suyo")

    }

});

CourtsDB.delete( "/Delete_dbproduct/:id", TypeUserCheck(), async (req,res) => {

    let user = req.user;

        const { params: {id} } = req;

        let producto = await modelCourts.findById(id);

        if(user.typeUser === "admin" && producto.owner === "admin"){

            await modelCourts.deleteOne({_id: id});

            console.log("admin ha eliminado producto de admin");

            res.status(204).json("producto eliminado por el admin");
        }
        else if(user.typeUser === "admin" && producto.owner !== "admin"){

            await modelCourts.deleteOne({_id: id});

            console.log("admin ha eliminado producto de usuario: " + producto.owner);

            await email.deletePremium(req);

            res.status(204).json("producto de usuario de id " + producto.owner + " ha sido eliminado por admin");

        }
        else if(user.typeUser === "premium" && producto.owner === user.id){

            await modelCourts.deleteOne({_id: id});

            res.status(204).json("producto eliminado por su dueño");
        }
        else if(user.typeUser === "premium" && producto.owner !== user.id){

            res.status(400).json("el usuario no puede eliminar un producto que no es suyo")

        }

});

CourtsDB.get("/product/:cid", authToken("jwt"), async (req,res) => {

    let cid = req.params.cid;

    let productos =  await CourtsDBcontroller.get(res);

    let producto = productos.filter( (element) => element._id.toString() === cid);
    console.log(producto);

    res.status(200).json(producto);

});

CourtsDB.put("/:id/:court_id/:typeFile/:courtName", uploader.single("MyFile"), async(req,res) => {

    let court_id = req.params.court_id

    if(!req.file){

        res.status(400).send({status: "error", error: "no se cargo la imagen"});
    }

    console.log("files: " + req.file.originalname, " id: " + court_id);

    let product = await modelCourts.findById(court_id);

    product.Thumbnail.push({
        name: req.file.originalname
    });

    product.save();

    return res.status(200).send("tu imagen " + req.file.originalname + " se ha guardado en el archivo del producto " + product.title);

});

// GET para enviar archivos de fotos de productos (Thumbnail)

CourtsDB.get("/sendFiles/:file/:image", (req,res) => {

    let typeFile = req.params.file;
    let image = req.params.image

    console.log(_Dirname + "/src/public/" + typeFile)

    res.status(200).sendFile( _Dirname + "/src/public/" + typeFile + "/" + image );

})




export default CourtsDB