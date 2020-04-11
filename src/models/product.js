export default (sequelize, DataTypes) => {
    const Product = sequelize.define('product', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        discount: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        catagory: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Product.associate = (models) => {
        Product.hasMany(models.Stock, { onDelete: 'cascade' });
        Product.belongsTo(models.ProductType, { foreignKey: 'productTypeId' });
        Product.hasMany(models.ProductPropertyValue, { onDelete: 'cascade' });
    };


    return Product;
    
};