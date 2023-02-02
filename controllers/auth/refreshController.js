
import  Joi  from 'joi';
import { JWT_REFRESH_TOKEN } from '../../config';
import { Refreshtoken, User } from '../../models';
import CustomErrorHandler from '../../service/CustomErrorHandler';
import JwtService from '../../service/JwtService';

const refreshController = {

    async refresh(req, res, next){
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required(),
        })
        const { error } = refreshSchema.validate(req.body)
        
        if(error){
            return next(error)
        }
        
        let refreshToken;
        let userId;
        
        try{    
            refreshToken = await Refreshtoken.findOne({token :req.body.refresh_token}) 

            if(!refreshToken){
                return next(CustomErrorHandler.unAuthorized("Invalid refresh token"))
            }  
            try{
                const { _id } = await JwtService.verify(refreshToken.token, JWT_REFRESH_TOKEN)
                userId = _id
            }
            catch(err){
                return next(CustomErrorHandler.unAuthorized("Invalid refresh token"))
            }
            const user = await User.findOne({_id: userId})

            if(!user){
                return next(CustomErrorHandler.unAuthorized("No user found"))
            }

           const access_token =  JwtService.signtoken({_id:user._id, role:user.role})
           const refresh_token =  JwtService.signtoken({_id:user._id, role:user.role}, '1y', JWT_REFRESH_TOKEN)
                
                // white list refresh_token
             await Refreshtoken.create({token:refresh_token})
                
            res.json({access_token, refresh_token })
        }   
        catch(err){
            return next(err)
        }
    }
}
export default refreshController