const typeDef = `
type ProductType {
    id: ID!
    name: String!
    products: [ProductType]
    productPropertyNames: [ProductPropertyName]
    typePropertyNames: [TypePropertyName]
}`;

const resolvers = {
    ProductType: {
        products: (productType) => {
            return productType.getProducts();
        },
        productPropertyNames: (productType) => {
            return productType.getProductPropertyNames();
        },
        typePropertyNames: (productType) => {
            return productType.gettypePropertyNames();
        }
    }
};

export {typeDef, resolvers};