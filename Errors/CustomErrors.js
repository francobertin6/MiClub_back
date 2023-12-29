
export default class CustomErrors{

    static CreateError({name="error", cause, message, code=1}){

        const error = new Error(message,{cause});
        error.name = name;
        error.code = code;
        throw error;
    }
}