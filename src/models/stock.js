export default (sequelize, DataTypes) => {
    const Stock = sequelize.define('stock', {
        quantity: {
            type: DataTypes.INTEGER
        }
    });

    Stock.associate = (models) => {
        Stock.belongsTo(models.Product);
        Stock.belongsToMany(models.PropertyValue, { through: 'StockProperties'});
    };
    
    return Stock;
};