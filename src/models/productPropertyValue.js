export default (sequelize, DataTypes) => {
    const ProductPropertyValue = sequelize.define('productPropertyValue', {
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        productPropertyNameId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false
        }

    });

    ProductPropertyValue.associate = (models) => {
        ProductPropertyValue.belongsTo(models.ProductPropertyName);
        ProductPropertyValue.belongsTo(models.Stock);
        ProductPropertyValue.belongsTo(models.Product);
    };

    return ProductPropertyValue;
};