import { PubSub } from 'apollo-server'
import { TESTIMONIAL_CREATED, OPTION_VOTED } from '../../constants/Subscriptions';
import * as testimonialService from './service'

const pubsub = new PubSub()

export default {
  queries: {
    testimonials() {
      return testimonialService.findAll().catch()
    }
  },

  mutations: {
    async createTestimonial(parent, args) {
      const testimonial = await testimonialService.create(args.testimonial).catch();

      pubsub.publish(TESTIMONIAL_CREATED, {
        [TESTIMONIAL_CREATED]: testimonial
      })

      return testimonial
    },

    async voteOnTestimonial(parent, args) {
      const testimonial= await testimonialService.voteOnTestimonial(args.optionId).catch();

      pubsub.publish(OPTION_VOTED, {
        [OPTION_VOTED]: testimonial.options.find((option) => {
          return option._id.toString() === args.optionId
        })
      })

      return testimonial
    }
  },

  subscriptions: {
    [TESTIMONIAL_CREATED]: {
      subscribe: () => pubsub.asyncIterator(TESTIMONIAL_CREATED),
    },

    [OPTION_VOTED]: {
      subscribe: () => pubsub.asyncIterator(OPTION_VOTED),
    }
  },
}