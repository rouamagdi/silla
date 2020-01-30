import Testimonial from '../../models/Testimonial/Testimonial'

export function create(data) {
  return Testimonial.create(data)
}

export function findAll() {
  return Testimonial.find().sort({ createdAt: -1 })
}

export function voteOnPoll(optionId) {
  return Testimonial.findOneAndUpdate({
    'options._id': optionId,
  }, {
    $inc: {
      'options.$.votes': 1,
    },
  }, {
    new: true,
  })
}