
import CustomErrorHandler from '../../service/CustomErrorHandler';
import { User } from '../../models'


const UserController = {

    async me(req, res, next) {
        const { _id } = req.user
        try{
            const user = await User.findOne({_id}).select('-password -__v -createdAt -updatedAt')
            if(!user){
                return next(CustomErrorHandler.notFound())
            }
            res.json(user)
        }   
        catch(err){
            return next(err)
        } 
    }

}

export default UserController