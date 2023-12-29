import  express  from "express";
import _Dirname from "../../../utils.js";
import { uploader } from "../../../utils.js";
import { TypeUserCheck, authToken } from "../../../utils.js";
import fs from "fs"

import modelClubs from "../../models/modelClubs.js";
import modelUsers from "../../models/modelUsers.js";

const clubDB = express.Router();
clubDB.use(express.json());
clubDB.use(express.static( _Dirname + "/src/public"));


clubDB.post("/postClubs", authToken("jwt"), async(req,res) => {

    let {body} = req;
    let user = req.user;

    let usuario = await modelUsers.findById(user.id);
    console.log(body);

    if(usuario.typeUser === "user"){

        usuario.typeUser = "owner";
        usuario.save();

    }

    const club = {
        owner: user.id,
        ...body
    }

    await modelClubs.create(club);

    fs.mkdirSync(_Dirname + "/src/public/clubs/" + user.id + "/courts", { recursive: true });
    fs.mkdirSync(_Dirname + "/src/public/clubs/" + user.id + "/profilesPictures", { recursive: true })


    res.status(200).json({id: user.id});

});

clubDB.post("/:typeFile/:id", uploader.single("MyFile") ,async(req,res) => {

    let id = req.params.id;
    let file = req.file.originalname;

    if(!req.file){

        res.status(404).send("no hay archivo");

    }

    let club = await modelClubs.findOne({owner: id});

    console.log(club);

    club.profilePicture = file;

    club.save();

    res.status(200).json("el usuario " + club.name + " ha sido modificado " + file);

});

clubDB.get("/getClub", authToken("jwt"), async(req,res) => {

    let id = req.user.id;
    let owner = req.user.typeUser;

    if(owner === "owner"){

        let UserClub = await modelClubs.findOne({owner: id}); 

        res.status(200).json(UserClub);

    }
    else{

        res.status(401).json("el usuario no tiene los permisos de dueño de club");

    }


});

clubDB.get("/sendFiles/:file/:image", authToken("jwt"), (req,res) => {

    let typeFile = req.params.file;
    let image = req.params.image;
    let id = req.user.id;

    console.log(id)
    console.log(_Dirname + "/src/public/clubs/"+ id + "/" + typeFile + "/" + image)

    res.status(200).sendFile( _Dirname + "/src/public/clubs/"+ id + "/" + typeFile + "/" + image );

});


export default clubDB;