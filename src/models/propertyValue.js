export default (sequelize, DataTypes) => {
    const PropertyValue = sequelize.define('propertyValue', {
        value: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    PropertyValue.associate = (models) => {
        PropertyValue.belongsTo(models.PropertyName);
        PropertyValue.belongsToMany(models.Stock, { through: 'StockProperties'});
        PropertyValue.belongsToMany(models.Product, { through: 'ProductProperties'});
    };

    return PropertyValue;
};