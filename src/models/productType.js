export default (sequelize, DataTypes) => {
    const ProductType = sequelize.define('productType', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    ProductType.associate = (models) => {
        ProductType.hasMany(models.ProductPropertyName);
        ProductType.hasMany(models.TypePropertyName);
        ProductType.hasMany(models.Product, { foreignKey: 'productTypeId' });
        
    };

    return ProductType;
};