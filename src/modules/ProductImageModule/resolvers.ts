import { ProductImageProvider } from "./provider";

export default {
  Mutation: {
    uploadProductImages: (_, { productId, files }, { injector }) =>
      injector.get(ProductImageProvider).uploadProductImages(productId, files),
    deleteProductImage: (_, { id }, { injector }) =>
      injector.get(ProductImageProvider).deleteProductImage(id),
    updateProductImagePriority: (_, { id, priority }, { injector }) =>
      injector.get(ProductImageProvider).updateProductImagePriority(id, priority),
  },

  Product: {
    images: (product, _, { injector }) => 
      injector.get(ProductImageProvider).getProductImages(product.id),
  }
  
};