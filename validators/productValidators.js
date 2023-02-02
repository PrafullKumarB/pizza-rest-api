
import Joi from 'joi'


const producSchema = Joi.object({
    name:Joi.string().required(),
    size:Joi.string().required(),
    price:Joi.number().required()
})

export default producSchema
