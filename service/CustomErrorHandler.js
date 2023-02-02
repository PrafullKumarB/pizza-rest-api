


class CustomErrorHandler extends Error {

    constructor(status, message){
        super();
        this.status = status,
        this.message = message
    }
    
    static alreadyUserExists(message){
        return new CustomErrorHandler(409, message)
    }
    
    static wrongCredential(message = "Username and password not valid"){
        return new CustomErrorHandler(401, message)
    }

    static unAuthorized(message = "unAuthorized"){
        return new CustomErrorHandler(401, message)
    }
    static notFound(message ="404 not found"){
        return new CustomErrorHandler(404, message)
    }
    static serverError(message = "Internal server Error"){
        return new CustomErrorHandler(500, message)
    }
}

export default CustomErrorHandler


