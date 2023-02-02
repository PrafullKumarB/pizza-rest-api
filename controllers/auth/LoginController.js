
import  Joi  from 'joi';
import bcrypt from 'bcrypt'

import { Refreshtoken, User } from '../../models';
import CustomErrorHandler from '../../service/CustomErrorHandler';
import JwtService from '../../service/JwtService';
import { JWT_REFRESH_TOKEN } from '../../config';

const LoginController = {
    async login(req, res, next){
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password : Joi.string().pattern(new RegExp('^[a-zA-Z0-1]{3,30}$')).required(),
        })
        const { error } = loginSchema.validate(req.body)
        
        if(error){
            return next(error) 
        }
        const { email, password } = req.body
        let access_token;
        let refresh_token;
        
        try{
            const user = await User.findOne({email })
            if(!user){
                return next(CustomErrorHandler.wrongCredential())
            }

            const match = await bcrypt.compare(password, user.password)
            
            if(!match){
                return next(CustomErrorHandler.wrongCredential())
            }

            access_token = await JwtService.signtoken({_id:user._id, role:user.role})
            refresh_token =  JwtService.signtoken({_id:user._id, role:user.role}, '1y', JWT_REFRESH_TOKEN)
            await Refreshtoken.create({token:refresh_token})

            res.json({access_token, refresh_token})
        }
        catch(err){
            return next(err)
        }
    },

    async logout(req, res, next){
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required(),
        })
        const { error } = refreshSchema.validate(req.body)
        
        if(error){
            return next(error)
        }

        try{
          await Refreshtoken.deleteOne({ token: req.body.refresh_token})

        }
        catch(err){
            return next(err)
        }
        res.status(200).json({message:"logout"})
    }
}

export default LoginController