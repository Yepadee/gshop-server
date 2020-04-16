export default (sequelize, DataTypes) => {
    const ProductPropertyName = sequelize.define('productPropertyName', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        productTypeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: "uniqueFK"
        }
    });

    ProductPropertyName.associate = (models) => {
        ProductPropertyName.belongsTo(models.ProductType);
        ProductPropertyName.hasMany(models.ProductPropertyValue, { onDelete: 'cascade' });
    };

    return ProductPropertyName;
};
