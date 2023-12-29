import express from "express";
import _Dirname from "../../../utils.js";
import passport from "passport";
import { GenerateToken } from "../../../utils.js";
import { uploader, authToken } from "../../../utils.js";

import modelUsers from "../../models/modelUsers.js";


const usersDB = express.Router();
usersDB.use(express.json());
usersDB.use(express.static(_Dirname + "/src/public"));


usersDB.post("/Post_dbusers", passport.authenticate('register'), (req,res) => {

    res.status(200).json("el usuario"+ req.user +"ha sido logueado exitosamente");

})

usersDB.get("/Get_dbusers", async (req,res) => {

    let result = await modelUsers.find().populate("cart");

    let filterResultData = result.map((element) => {
        
        return({
            name: element.name,
            email: element.email,
            typeUser: element.typeUser
        })

    })

    res.status(200).json(filterResultData);

});


usersDB.post("/LoginUser", passport.authenticate('login'), async (req,res) => {

    res.status(200).send("el usuario ha sido logueado exitosamente");

})

// COOKIES/SET_COOKIES: setea el token de JWT en las cookies cuando se hace el logib
usersDB.post("/cookies/set_cookies", async (req,res) => {

    const { username } = req.body;

    console.log("usuario: " + username);

    const user = await modelUsers.findOne({username:username});

    let token = null;

    if(!user){

        res.status(404).json("el usuario es inexistente")

    }else{
        token = GenerateToken(user);

        console.log("Token: " + token);

        res.status(200).json(token);
    }

});

// CURRENT: devuelve mediante el token de JWT los datos del usuario
usersDB.get("/current", authToken("jwt") ,async (req,res) => {

    let user = req.user;

    console.log(user)

    let usuario = await modelUsers.findById(user.id);

    res.status(200).json(usuario);

});

// METODO PARA CAMBIAR A UN USUARIO DE USER COMUN A PREMIUM
usersDB.put("/changeTypeUser/:typeUser", authToken("jwt"), async (req,res) => {

    let id = req.user.id;

    let typeUser = req.params.typeUser;

    let user = await modelUsers.findById(id);


    if(user !== undefined){

        res.status(200).send("el tipo de usuario se ha modificado");

    }else{

        res.status(404).send("el tipo de usuario no pudo ser modificado");

    }

    user.typeUser = typeUser;

    user.save();

});

usersDB.put("/:uid/:typeFile/documents", uploader.single("MyFile"), async (req,res) => {

    let id = req.params.uid;
    let File = req.file.originalname;

    if(!req.file){

        return res.status(404).send({status: "error", error: "no se pudo guardar la imagen"});

    }

    console.log("files: " + req.file.originalname, " id: " + id);

    let user = await modelUsers.findById(id);

    user.documents.push({
        name: req.file.originalname,
        reference: req.params.typeFile
    });
    
    user.save();

    return res.status(200).send("el archivo " + req.file.filename + " se ha guardado en el archivo del usuario " + user.username);

})

// METODO PARA ELIMINAR USUARIOS INACTIVOS
usersDB.delete("/deleteInactiveUser", async(req,res) => {

    let users = await  modelUsers.find();

    let createUserObject = users.map( (element) => {

        return {
            id: element._id,
            lastConnection: element.last_connection
        }

    })

    console.log(createUserObject);

    let inactiveUser = createUserObject.filter( (element) => {

        let currentDate = new Date();

        let inactive_or_not = element.lastConnection.getDay() - currentDate.getDay();

        console.log(element.lastConnection.getDay() - currentDate.getDay());

        if(inactive_or_not > 2){
            
            return element

        }
    })

    if(inactiveUser.length !== 0){
        
        inactiveUser.forEach( async (element) => {

            await modelUsers.deleteOne(element.id);

        })

        res.status(200).send("estos usuarios han sido eliminados: " + JSON.stringify(inactiveUser));
    }
    else{
        res.status(404).send("no se ha encontrado ningun usuario");
    }

})

// login con github
usersDB.get("/github_login", passport.authenticate('github', {scope: ['user:email']}))

usersDB.get('/github_login/callback', passport.authenticate('github', { failureRedirect: 'http://127.0.0.1:8080/login' }), (req,res) => {

        console.log('req.user: ', req.user);
        req.session.user = req.user;
        res.status(200).send("el usuario ha podido loguearse");


})
 



export default usersDB;