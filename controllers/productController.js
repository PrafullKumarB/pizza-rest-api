import { Product } from "../models"
import multer from 'multer'
import path from 'path';
import fs from 'fs';
import CustomErrorHandler from "../service/CustomErrorHandler"
import producSchema from "../validators/productValidators";

const storage = multer.diskStorage({
    destination: (req, file, cb )=> cb(null, 'uploads/'),
    
    filename :(req, file, cb) =>{
        const uniqName = `${Date.now()}-${Math.random(Math.random() * 1E9)}${path.extname(file.originalname)}`
        cb(null, uniqName)
    }
})

const upload = multer({ storage ,limits: { fileSize : 1000000 * 5}}).single('image')

const productController = {
    async store(req, res, next){
        let filePath;

        upload(req, res,async (err)=>{
            if(err){
                return next(CustomErrorHandler.serverError(err.message))
            }
            filePath = req.file.path
            
            const { error } = producSchema.validate(req.body)

            if(error){
                fs.unlink(`${appRoot}/${filePath}`, (err)=>{
                    if(err){
                        return next(CustomErrorHandler.serverError(err.message))
                    }
                }) 
              return next(error)
            }

            const { name ,price ,size} = req.body 
            let document;

            try{
                document = await Product.create({
                    name,
                    price,
                    size,
                    image: filePath
                })
                res.status(201).json(document)
            }
            catch(error){
                return next(error) 
            }
        })
    },

    async update(req, res, next){

         upload(req, res,async (err)=>{
            if(err){
                return next(CustomErrorHandler.serverError(err.message))
            }
            
            let filePath 
            
            if(req.file){
                filePath = req.file.path
            }

            const { error } = producSchema.validate(req.body)
        
            if(error){
                if(req.file){
                    fs.unlink(`${appRoot}/${filePath}`, (err)=>{
                        if(err){
                            return next(CustomErrorHandler.serverError(err.message))
                        }
                    }) 
                }
              return next(error)
            }

            const { name, price ,size} = req.body 
            
            let document; 
            try{
                document = await Product.findOneAndUpdate({_id: req.params.id} ,{
                    name,
                    price,
                    size,
                    ...(req.file && { image: filePath })
                }, { new: true })
                res.status(201).json(document)
            }
            catch(error){
                return next(error) 
            }
        })        
    },

    async delete(req, res,next){
        try{
            const response = await Product.findOneAndRemove({_id:req.params.id})
            if(!response){
                return next(new Error("Nothing to delete"))
            }
            const imagePath = response._doc.image
            fs.unlink(`${appRoot}/${imagePath}`, (err)=>{
                if(err){
                    return next(CustomErrorHandler.serverError(err.message))
                }
            })
            res.json(response)
        }
        catch(err){
            return next(err)
        }
    },
    async index(req, res, next){
        let document;
        // pagination = mongoose-pagination
        try{
            document = await Product.find().select('-updatedAt -__v').sort({ _id: -1}) // -1 descending 
            if(!document){
                return next(new Error("No products found"))
            }
            res.json(document)
        }
        catch(err){
            return next(CustomErrorHandler.serverError())
        }
    },
    async show(req, res, next) {

        try{
            const document = await Product.findOne({_id: req.params.id}).select('-updatedAt -__v')
            if(!document){
                return next(new Error("No products found"))
            }
            res.json(document)
        }
        catch(err){
          return next(CustomErrorHandler.serverError())  
        }
    }
}

export default productController