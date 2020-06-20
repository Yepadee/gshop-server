import { PropertyNameProvider } from "./provider";

export default {
    Query: {
      propertyNames: (_, args, { injector }) => injector.get(PropertyNameProvider).getPropertyNames(args),
      propertyName: (_, { id }, { injector }) => injector.get(PropertyNameProvider).getPropertyNameById(id)
    },

    Mutation: {
      addPropertyName: (_, { name }, { injector }) => injector.get(PropertyNameProvider).addPropertyName(name),
      deletePropertyName: (_, { id }, { injector }) => injector.get(PropertyNameProvider).deletePropertyName(id)
    },

    ProductType: {
      propertyNames: productType => productType.propertyNames
    },

    PropertyName: {
      name: propertyName => propertyName.name,
      values: propertyName => propertyName.propertyValues
    },

    Product: {
      requiredProperties: product => product.requiredProperties
    },

    PropertyValue: {
      propertyName: propertyValue => propertyValue.propertyName
    }
  
};