import { ProductProvider } from "../../providers/typePropertyValue.provider";

export default {
    Query: {
      products: (_, args, { injector }) => injector.get(ProductProvider).getProducts(args),
      product: (_, { id }, { injector }) => injector.get(ProductProvider).getProductById(id)
    },
    Product: {
      id: product => product.id,
      name: product => product.name
    }
  };