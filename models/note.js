import mongoose, { Schema } from "mongoose";

const noteSchema = mongoose.Schema({
    title: {
        type: String, 
        required: true
    },
    description: {
        type: String,
        required: true
    },
    writtenBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String, 
        enum: ["completed", "pending"],
        default: "pending"
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    tags: {
        type: [String],
        required: false,
        default: null,
        lowercase: true
    }

}, { timestamps: true })

export default mongoose.model('Note', noteSchema);