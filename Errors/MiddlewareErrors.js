import EError from './ErrorEnums'

const MiddlewareError = (error, res, req, next) => {

    console.log(error)

    switch(error.code){
        case EError.INVALID_TYPES_ERROR:

            res.send({status: 'error', message:"Datos invalidos"})

        break;
        case EError.DATABASE_ERROR:

            res.send({status: 'error', message:"Error de database"})

        break;
        case EError.ROUTING_ERROR:

            res.send({status: 'error', message:"Error de routing"})

        break;
        default:

            res.send({status: 'error', message:"Error no manejable"})

        break;
    }
}


export default MiddlewareError;