
import Joi from 'joi'
import { Refreshtoken, User } from '../../models';
import bcrypt from 'bcrypt'

import CustomErrorHandler from '../../service/CustomErrorHandler';
import JwtService from '../../service/JwtService';
import { JWT_REFRESH_TOKEN } from '../../config';


const regitserController = {

    async register(req, res, next){

            const regitserSchema = Joi.object({
                name: Joi.string().min(3).max(10).required(),
                email: Joi.string().email().required(),
                password : Joi.string().pattern(new RegExp('^[a-zA-Z0-1]{3,30}$')).required(),
                repeat_password: Joi.ref('password')
            })

            const { error } = regitserSchema.validate(req.body);

            if(error){
                return next(error)
            }

            const { name, email, password } = req.body

            try{
                const exists = await  User.exists({email})
                if(exists){
                    return next(CustomErrorHandler.alreadyUserExists("User already exists"))
                }
            }
            catch(err){
                   return next(err) 
            }
            const hashedPassword = await  bcrypt.hash(password, 10)
            
            const userPayload = new User({
                name, email, password:hashedPassword
            })

            let access_token;
            let refresh_token;

            try{
                const result = await userPayload.save()
                //Token generation 
                access_token =  JwtService.signtoken({_id:result._id, role:result.role})
                refresh_token =  JwtService.signtoken({_id:result._id, role:result.role}, '1y', JWT_REFRESH_TOKEN)
                
                // white list refresh_token
                await Refreshtoken.create({token:refresh_token})

            }
            catch(err){
                return next(err)

            }

            res.json({ access_token , refresh_token })

    }
}

export default regitserController