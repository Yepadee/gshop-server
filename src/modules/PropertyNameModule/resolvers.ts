import { PropertyNameProvider } from "./provider";

export default {
    Query: {
      propertyNames: (_, args, { injector }) => injector.get(PropertyNameProvider).getPropertyNames(args),
      propertyName: (_, { id }, { injector }) => injector.get(PropertyNameProvider).getPropertyNameById(id)
    },

    Mutation: {
      addPropertyName: (_, { name }, { injector }) => injector.get(PropertyNameProvider).addPropertyName(name),
    },

    ProductType: {
      typePropertyNames: productType => productType.typePropertyNames
    },

    TypePropertyName: {
      values: propertyName => propertyName.propertyValues
    },

    Product: {
      requiredProperties: product => product.requiredProperties
    }
  
};