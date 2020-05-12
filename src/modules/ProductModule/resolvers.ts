import { ProductProvider } from "./provider";

export default {
    Query: {
      products: (_, args, { injector }) => injector.get(ProductProvider).getProducts(args),
      product: (_, { id }, { injector }) => injector.get(ProductProvider).getProductById(id)
    },

    Product: {
      id: product => product.id,
      name: product => product.name,
      description: product => product.description,
      catagory: product => product.catagory,
      price: product => product.price,
    }
  
};