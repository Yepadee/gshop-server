export default (sequelize, DataTypes) => {
    const PropertyName = sequelize.define('propertyName', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    PropertyName.associate = (models) => {
        PropertyName.belongsTo(models.ProductType);
        PropertyName.hasMany(models.PropertyValue);
    };

    return PropertyName;
};