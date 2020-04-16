export default (sequelize, DataTypes) => {
    const ProductPropertyValue = sequelize.define('productPropertyValue', {
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: "compositeKey"
        },
        productPropertyNameId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: "compositeKey"
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: "compositeKey"
        }

    });

    ProductPropertyValue.associate = (models) => {
        ProductPropertyValue.belongsTo(models.ProductPropertyName);
        ProductPropertyValue.belongsTo(models.Stock);
        ProductPropertyValue.belongsTo(models.Product);
    };

    return ProductPropertyValue;
};