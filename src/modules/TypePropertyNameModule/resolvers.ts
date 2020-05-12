import { TypePropertyNameProvider } from "./provider";

export default {
    ProductType: {
      typePropertyNames: productType => productType.typePropertyNames
    },

    TypePropertyName: {
      values: propertyName => propertyName.propertyValues
    },

    Product: {
      typeProperties: (product, _, { injector }) => injector.get(TypePropertyNameProvider).getTypePropertiesByTypeId(product.typeId)
    }
  
};