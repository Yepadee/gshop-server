import { ProductTypeProvider } from "./provider"

export default {
    Query: {
      productTypes: (_, args, { injector }) => injector.get(ProductTypeProvider).getProductTypes(args),
      productType: (_, { id }, { injector }) => injector.get(ProductTypeProvider).getProductTypeById(id)
    },

    ProductType: {
      id: product => product.id,
      name: product => product.name
    },

    Product: {
      type: product => product.type
    }
    
  };