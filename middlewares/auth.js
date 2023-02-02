import CustomErrorHandler from "../service/CustomErrorHandler"
import JwtService from "../service/JwtService";


const auth= async (req, res, next)=>{
        
    const hearder = req.headers.authorization
    if(!hearder){
        return next(CustomErrorHandler.unAuthorized())
    }
    const access_token = hearder.split(" ")[1]

    try{
        const { _id, role } = await JwtService.verify(access_token)
        const user = {
            _id, role
        }  
        req.user = user
        next()
    }   
    catch(err){
        return next(CustomErrorHandler.unAuthorized())
    }
}

export default auth