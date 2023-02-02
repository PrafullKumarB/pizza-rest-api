
import mongoose  from "mongoose";

const Schema = mongoose.Schema;

const refreshToken = new Schema({
    token:{
        type:String,
        uniq:true
    }

},{timestamps: false})


export default mongoose.model('Refreshtoken',refreshToken,'refreshTokens')

