export default (sequelize, DataTypes) => {
    const TypePropertyValue = sequelize.define('typePropertyValue', {
        value: {
            type: DataTypes.STRING,
            allowNull: false
        },
        typePropertyNameId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    TypePropertyValue.associate = (models) => {
        TypePropertyValue.belongsTo(models.TypePropertyName);
        TypePropertyValue.belongsToMany(models.Stock, { through: "stockTypePropertyValues" });
    };

    return TypePropertyValue;
};