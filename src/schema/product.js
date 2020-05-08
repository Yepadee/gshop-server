import { groupBy } from 'lodash';

import db from '../models';

const typeDef = `
type Product {
    id: ID!
    name: String!
    description: String
    price: Float
    discount: Float
    catagory: String!
    productType: ProductType!
    stock: [Stock]
    productProperties: [ProductProperty]
    typeProperties: [TypeProperty]
}

type ProductProperty {
    name: String!
    values: [ProductPropertyValue]
}

type TypeProperty {
    name: String!
    values: [TypePropertyValue]
}
`;

const resolvers = {
    Product: {
        stock: (product) => {
            return product.getStocks();
        },
        productProperties: async (product) => {
            return product.getProductPropertyValues({ include: [{ model: db.models.productPropertyName, attributes: ['name'] }] }).then((propertyValues => {
                const grouped = groupBy(propertyValues, propertyValue => propertyValue.productPropertyName.name);
                return Object.keys(grouped).map((propertyName) => {
                    const productProperty = {
                        name: propertyName,
                        values: grouped[propertyName]
                    };
                    return productProperty;
                });
            }));
        },
        typeProperties: async (product) => {
            return product.getProductType({ attributes: ['id'] }).then((productType => {
                return db.models.typePropertyValue.findAll({
                    include: [{
                        model: db.models.typePropertyName, attributes: ['name'],
                        where: { productTypeId: productType.id }
                    }]
                }).then((typePropertyValues) => {
                    const grouped = groupBy(typePropertyValues, typePropertyValue => typePropertyValue.typePropertyName.name);
                    return Object.keys(grouped).map((propertyName) => {
                        const typeProperty = {
                            name: propertyName,
                            values: grouped[propertyName]
                        };
                        return typeProperty;
                    });
                });
            }));
        }
    }
};

export { typeDef, resolvers };