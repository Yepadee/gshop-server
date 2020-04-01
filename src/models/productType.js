export default (sequelize, DataTypes) => {
    const ProductType = sequelize.define('productType', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    ProductType.associate = (models) => {
        ProductType.hasMany(models.PropertyName);
        ProductType.hasMany(models.Product, { foreignKey: 'productTypeId' });
    };

    return ProductType;
};