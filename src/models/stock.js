export default (sequelize, DataTypes) => {
    const Stock = sequelize.define('stock', {
        quantity: {
            type: DataTypes.INTEGER
        }
    });

    Stock.associate = (models) => {
        Stock.belongsTo(models.Product);
        Stock.hasMany(models.ProductPropertyValue);
        Stock.belongsToMany(models.TypePropertyValue, { through: "stockTypePropertyValues" });
    };
    
    return Stock;
};