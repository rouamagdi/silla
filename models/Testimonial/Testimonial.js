import mongoose from 'mongoose';
import User from '../User/User';

const Schema = mongoose.Schema;

const OptionSchema = new Schema({
    name: String,
    votes: {
      type: Number,
      default: 0,
    },
  })
  
/**
 * Testimonial schema that has references to User, Like and Comment schemas
 */
const TestimonialSchema = Schema(
    {   
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        tree:{
            type: Schema.Types.ObjectId,
            ref: 'Tree',
        },
        group:{
            type: Schema.Types.ObjectId,
            ref: 'Group',
        },
        question: String,
        options: [OptionSchema],
        voted: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'TestimonialLike',
            },
        ],
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'TestimonialComment',
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true,
    }
);


export default mongoose.model('Testimonial', TestimonialSchema);