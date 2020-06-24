import { ProductImageProvider } from "./provider";

export default {
  Mutation: {
    uploadProductImages: async (_, { productId, files }, { injector }) =>
      injector.get(ProductImageProvider).uploadProductImages(productId, files),
    deleteProductImage: async (_, { imageId }, { injector }) =>
      injector.get(ProductImageProvider).deleteProductImage(imageId),
  },

  Product: {
    images: product => product.images,
  }
  
};