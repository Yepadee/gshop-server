import { UserProvider } from "./provider";

export default {
    Query: {
      users: (_, args, { injector}) => {
        return injector.get(UserProvider).getUsers(args);
      },
      user: (_, { id }, { injector }) => injector.get(UserProvider).getUserById(id)
    },

    Mutation: {
      addUser: (_, { username, password }, { injector }) => injector.get(UserProvider).addUser(username, password),
      changePassword: (_, { id, newPassword }, { injector }) => injector.get(UserProvider).changePassword(id, newPassword),
    },

    User: {
      username: user => user.username
    }
  
};