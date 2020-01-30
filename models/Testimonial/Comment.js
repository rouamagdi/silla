import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * Comments schema that has reference to Testimonial and user schemas
 */
const TestimonialCommentSchema = Schema(
  {
    comment: {
      type: String,
      required: true,
    },
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

export default mongoose.model('TestimonialComment', TestimonialCommentSchema);
