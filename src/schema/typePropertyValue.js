const typeDef = `
type TypePropertyValue {
    id: ID!
    value: String!
    propertyName: ProductPropertyName!
}
`;

const resolvers = {
    TypePropertyValue: {
        propertyName: (typePropertyValue) => {
            return typePropertyValue.getTypePropertyName();
        },
    }
};

export {typeDef, resolvers};