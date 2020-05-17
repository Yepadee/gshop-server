import { UserProvider } from "./provider";

export default {
    Query: {
      users: (_, args, { injector, currentUser}) => {
        console.log(currentUser);
        return injector.get(UserProvider).getUsers(args);
      },
      user: (_, { id }, { injector }) => injector.get(UserProvider).getUserById(id)
    },

    Mutation: {
      addUser: (_, { username, password }, { injector }) => injector.get(UserProvider).addUser(username, password)
    },

    User: {
      username: user => user.username
    }
  
};