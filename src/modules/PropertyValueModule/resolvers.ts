import { PropertyValueProvider } from "./provider";

export default {
  Mutation: {
    addPropertyValue: (_, { propertyNameId, value }, { injector }) => injector.get(PropertyValueProvider).addPropertyValue(propertyNameId, value),
    removePropertyValue: (_, { id }, { injector }) => injector.get(PropertyValueProvider).removePropertyValue(id),
  },

  PropertyName: {
    values: propertyName => propertyName.propertyValues
  },

  Stock: {
    properties: stock => stock.properties
  },

  AvailableProperty: {
    values: availableProperty => availableProperty.values
  }
  
};