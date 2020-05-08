const typeDef = `
type TypePropertyName {
    id: ID!
    name: String!
    values: [TypePropertyValue]
    productType: ProductType!
}
`;

const resolvers = {
    TypePropertyName: {
        values: (typePropertyName) => {
            return typePropertyName.getTypePropertyValues();
        },
    }
};

export {typeDef, resolvers};