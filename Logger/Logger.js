import winston from "winston"


const customLevelOptions = {
    levels:{
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        debug: 4
    },
    colors:{
        fatal: 'red',
        error: 'orange',
        warning: "yellow",
        info: "blue",
        debug: "white"
    }

}

const logger = new winston.createLogger({

    // aca se define a que nivel va a pasar el logger y va a funcionar a nivel http

    transports: [
        new winston.transports.Console({ level: 'http' }),
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({ colors:customLevelOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({filename:'./errors.log', level: 'warn'})
    ]    
    
});

// a partir de un middleware vamos a colocar en el objeto req el logger

export const addLogger = ( req,res,next ) => {

    req.logger = logger;
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);

    next();
}