
import { ProductImageProvider } from "./provider";

export default {
  Mutation: {
    uploadImage: async (_, { name, file }, { injector }) => injector.get(ProductImageProvider).uploadImage(name, file)
  }
  
};