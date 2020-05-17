import { AuthProvider } from "./provider";

export default {
    Mutation: {
      login: (_, { username, password }, { injector }) => injector.get(AuthProvider).login(username, password)
    }
};