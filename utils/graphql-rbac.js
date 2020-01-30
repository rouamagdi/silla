import { RBAC } from 'graphql-rbac'

const roles = ['ADMIN', 'DEVELOPER']

const schema = {
  Query: {
    users: ['ADMIN', 'DEVELOPER']
  },
  Mutation: {
    createUser: ['ADMIN', 'DEVELOPER'],
    updateUser: ['ADMIN', 'DEVELOPER'],
    deleteUser: ['ADMIN']
  },
  User: {
    password: ['ADMIN']
  }
}

const typeDefs = `
  type Query {
    users: [User!]!
  }

  type Mutation {
    createUser: User!
    updateUser: User!
    deleteUser: User
  }

  type User {
    username: String!
    password: String!
  }
`

const resolvers = {
  Query: {
    users: () => [
      { username: 'Tom', password: '****' },
      { username: 'John', password: '****' },
    ]
  },
  Mutation: {
    createUser: () => { username: 'Tom', password: '****' },
    updateUser: () => { username: 'John', password: '****' },
    deleteUser: () => null
  }
}

const users = {
  admin: { role: 'ADMIN' },
  developer: { role: 'DEVELOPER' }
}

const getUser = async (req) => {
  const auth = req.request.headers.authorization
  let user = {}
  if (users[auth]) {
    user = users[auth]
  }

  return user
}

const rbac = new RBAC({roles, schema, getUser})

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  middlewares: [rbac.middleware()],
  context: req => ({
    user: rbac.context(req)
  }),
})