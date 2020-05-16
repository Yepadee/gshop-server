import { UserProvider } from "./provider";

export default {
    Query: {
      users: (_, args, { injector }) => injector.get(UserProvider).getUsers(args),
      user: (_, { id }, { injector }) => injector.get(UserProvider).getUserById(id)
    },

    Mutation: {
      login: (_, { username, password }, { injector }) => injector.get(UserProvider).login(username, password),
      addUser: (_, { username, password }, { injector }) => injector.get(UserProvider).addUser(username, password)
    },

    User: {
      username: user => user.username
    }
  
};