import db from '../models';

const typeDef = `
type Stock {
    id: ID!
    quantity: Int!
    productPropertyValues: [ProductPropertyValue]
    typePropertyValues: [TypePropertyValue]
    allProperties: [Property]
    product: ProductType
}

type Property {
    name: String!
    value: String!
}
`;

const resolvers = {
    Stock: {
        productPropertyValues: (stock) => {
            return stock.getProductPropertyValues();
        },
        typePropertyValues: (stock) => {
            return stock.getTypePropertyValues();
        },
        product: (stock) => {
            return stock.getProduct();
        },
        allProperties: async (stock) => {
            const productPropertyValues = await stock.getProductPropertyValues({ include: [{ model: db.models.productPropertyName, attributes: ['name'] }] });
            const productProperties = productPropertyValues.map((propertyValue) => {
                const property = {
                    name: propertyValue.productPropertyName.name,
                    value: propertyValue.value
                };

                return property;
            });

            const typePropertyValues = await stock.getTypePropertyValues({ include: [{ model: db.models.typePropertyName, attributes: ['name'] }] });
            const typeProperties = typePropertyValues.map((propertyValue) => {
                const property = {
                    name: propertyValue.typePropertyName.name,
                    value: propertyValue.value
                };
                return property;
            });

            return typeProperties.concat(productProperties);
        }
    }
};

export {typeDef, resolvers};