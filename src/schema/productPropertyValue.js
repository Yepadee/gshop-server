const typeDef = `
type ProductPropertyValue {
    id: ID!
    name: String!
    value: String!
    propertyName: ProductPropertyName!
}
`;

const resolvers = {
    ProductPropertyValue: {
        propertyName: (productPropertyValue) => {
            return productPropertyValue.getProductPropertyName();
        },
        name: async (productPropertyValue) => {
            const propertyName = await productPropertyValue.getProductPropertyName({ attributes: ['name'] });
            return propertyName.name;
        },
    }
};

export {typeDef, resolvers};