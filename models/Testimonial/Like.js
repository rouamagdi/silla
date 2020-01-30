import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Like schema that has references to Testimonial and User schema
 */
const TestimonialLikeSchema = Schema(
  {
    testimonial: {
      type: Schema.Types.ObjectId,
      ref: 'Testimonial',
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('TestimonialLike', TestimonialLikeSchema);
