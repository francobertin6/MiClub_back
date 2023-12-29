// dependencies
import  Express  from "express";
import session from "express-session";
import Handlebars from "express-handlebars";
import _Dirname from "./utils.js";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import { init } from "./src/db/mongodb.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./src/config/passport_config.js";
import { addLogger } from "./Logger/Logger.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi, { serve } from "swagger-ui-express"
import path from "path";
import cors from "cors";


//mongoDb imports/connection

init(); // mongo se conecta mediante este init


const server = Express();
server.use(Express.json());
server.use(Express.urlencoded({extended: true}));
server.use(bodyParser.json());
server.use(cookieParser()); 
server.use(session({
    resave: false,
    saveUninitialized: true,
    secret: "secret"
}));
server.use(cors());


// passport initialize
initializePassport();
server.use(passport.initialize());
server.use(passport.session());
server.use(addLogger);


// server
let httpServer = server.listen(process.env.PORT, () => {
    console.log("se inicializa server")
})

const io = new Server(httpServer);



// server.engine señala que motor pondremos en funcionamiento: handlebars 
server.engine("handlebars", Handlebars.engine())
// con (views, ruta) le vamos a indicar al servidor en que parte del proyecto estaran las vistas
server.set("views", _Dirname+ "/src/views");
// con (view engine, handlebars) indicamos que el motor que inicializamos arriba es el que queremos usar
server.set("view engine", "handlebars")
// seteamos de manera estatica nuestra carpeta public
server.use(Express.static(_Dirname + "/src/public"));
server.use(Express.static(_Dirname + "/src/views/layouts"));


// importacion ficheros DB
import CourtsDB from "./src/routes/DB/Courts.js";
import cartsDB from "./src/routes/DB/carrito.js";
import usersDB from "./src/routes/DB/usuarios.js";
import mail from "./src/routes/DB/mail.js";
import clubDB from "./src/routes/DB/club.js";



// endpoints
server.use("/CourtsDB", CourtsDB);
server.use("/cartsDB", cartsDB);
server.use("/userDB", usersDB);
server.use("/mail", mail);
server.use("/clubDB", clubDB);


// set/get/delete cookies

server.get("/cookies/delete_cookies/:cookie", (req,res) => {

    let cookie = req.params.cookie;

    res.clearCookie(cookie).send("la cookie fue removida");

})

//socket
io.on('connection', (clienteSocket) => {

    console.log(clienteSocket.id)

    //agregar producto con websocketss
    clienteSocket.on("product_data", (data) => {

        console.log(data);

        mercaderia.addProduct(JSON.parse(data));

    })

})


//Swagger

const SwaggerOptions = {
    definition:{
        openapi: '3.0.1',
        info:{
            title: "coderHouse backEnd",
            description: "description"
        }
    },
    apis:[path.join(`${_Dirname}/src/docs/**/*.yaml`)]
}

const specs = swaggerJSDoc(SwaggerOptions);

server.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs)); 