
import { ProductImageProvider } from "./provider";

export default {
  Mutation: {
    uploadProductImages: async (_, { productId, files }, { injector }) => injector.get(ProductImageProvider).uploadProductImages(productId, files),
    deleteProductImage:  async (_, { productId, filename }, { injector }) => injector.get(ProductImageProvider).deleteProductImage(productId, filename),
  }
  
};