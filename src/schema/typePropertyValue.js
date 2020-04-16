const typeDef = `
type TypePropertyValue {
    id: ID!
    name: String!
    value: String!
    propertyName: ProductPropertyName!
}
`;

const resolvers = {
    TypePropertyValue: {
        propertyName: (typePropertyValue) => {
            return typePropertyValue.getTypePropertyName();
        },
        name: async (typePropertyValue) => {
            const propertyName = await typePropertyValue.getTypePropertyName({ attributes: ['name'] });
            return propertyName.name;
        },
    }
};

export {typeDef, resolvers};