export default (sequelize, DataTypes) => {
    const ProductPropertyName = sequelize.define('productPropertyName', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    ProductPropertyName.associate = (models) => {
        ProductPropertyName.belongsTo(models.ProductType);
        ProductPropertyName.hasMany(models.ProductPropertyValue, { onDelete: 'cascade' });
    };

    return ProductPropertyName;
};
