import mongoose  from "mongoose";
import { APP_BUCKET_URL } from "../config";

const Schema = mongoose.Schema

const productSchema = new Schema({
    
    name :{
        type:String,
        required: true
    },
    price: {
        type:Number,
        required: true 
    },
    size: {
        type:String,
        required: true
    },
    image: {
        type:String,
        required: true,

        get: (image) => { // getter function only calls when we use res.json(document)
            return `${APP_BUCKET_URL}/${image}`
        }
    }
    
}, { timestamps: true , toJSON:{ getters: true},id: false}) // to actived getter need to add toJson

export default mongoose.model('Product', productSchema, 'products')
