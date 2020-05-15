import { ProductTypeProvider } from "./provider"

export default {
    Query: {
      productTypes: (_, args, { injector }) => injector.get(ProductTypeProvider).getProductTypes(args),
      productType: (_, { id }, { injector }) => injector.get(ProductTypeProvider).getProductTypeById(id)
    },

    Mutation: {
      addProductType: (_, { name, propertyNameIds }, { injector }) => injector.get(ProductTypeProvider).addProductType(name, propertyNameIds),
      removeProductType: (_, { productTypeId }, { injector }) => injector.get(ProductTypeProvider).removeProductType(productTypeId)
    },

    ProductType: {
      id: product => product.id,
      name: product => product.name
    },

    Product: {
      type: product => product.type
    }
    
  };