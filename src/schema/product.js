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
    productProperties: [ProductPropertyValue]
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
                console.log(propertyValues.reduce((r, a) => {
                    r[a.productPropertyNameId] = [...r[a.productPropertyNameId] || [], a];
                    return r;
                   }, {}));
            }));
        }
    }
};

export {typeDef, resolvers};