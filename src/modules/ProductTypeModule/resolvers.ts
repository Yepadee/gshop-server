import { ProductTypeProvider } from "./provider"

export default {
    Query: {
      productTypes: (_, args, { injector }) =>
        injector.get(ProductTypeProvider).getProductTypes(args),
      productType: (_, { id }, { injector }) =>
        injector.get(ProductTypeProvider).getProductTypeById(id)
    },

    Mutation: {
      addProductType: (_, { name, propertyNameIds }, { injector }) =>
        injector.get(ProductTypeProvider).addProductType(name, propertyNameIds),
      deleteProductType: (_, { id }, { injector }) =>
        injector.get(ProductTypeProvider).deleteProductType(id),
      addProductTypePropertyNames: (_, { id, propertyNameIds }, { injector }) =>
        injector.get(ProductTypeProvider).addPropertyNames(id, propertyNameIds),
      removeProductTypePropertyNames: (_, { id, propertyNameIds }, { injector }) =>
        injector.get(ProductTypeProvider).removePropertyNames(id, propertyNameIds),
    },

    ProductType: {
      id: product => product.id,
      name: product => product.name
    },

    Product: {
      type: product => product.type
    }
    
  };