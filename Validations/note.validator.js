import Joi from "joi";
import JoiObjectId from "joi-objectid";

const myJoiObjectId = JoiObjectId(Joi);

const noteSchema = Joi.object({
    title: Joi.string().min(3).max(30).required(),
    content: Joi.string().min(3).max(1000).required(),
    status: Joi.string().valid('pending', 'complete'),
    tags: Joi.array().items(Joi.string()),
    categoryId: myJoiObjectId('Category')
});

export default noteSchema;