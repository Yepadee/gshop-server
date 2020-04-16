import { groupBy  } from 'lodash';

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
}

type ProductProperty {
    name: String!
    values: [ProductPropertyValue]
}
`;

const resolvers = {
    Product: {
        stock: (product) => {
            return product.getStocks();
        },
        productProperties: (product) => {
            return product.getProductPropertyValues().then( (propertyValues => {
                const grouped = groupBy(propertyValues, propertyValue => propertyValue.productPropertyNameId);
                return Object.keys(grouped).map( async (propertyNameId) => {
                    const productName = await db.models.productPropertyName.findOne({ where: {id: propertyNameId} });
                    const productProperty = {
                        name: productName.name,
                        values: grouped[propertyNameId]
                    } ;
                    console.log(productProperty);

                    return productProperty;
                  });
                
            }));
        }
    }
};

export {typeDef, resolvers};