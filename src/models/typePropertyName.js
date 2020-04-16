export default (sequelize, DataTypes) => {
    const TypePropertyName = sequelize.define('typePropertyName', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: "compositeKey"
        },
        productTypeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: "compositeKey"
        }
    });

    TypePropertyName.associate = (models) => {
        TypePropertyName.belongsTo(models.ProductType);
        TypePropertyName.hasMany(models.TypePropertyValue, { onDelete: 'cascade' });
    };

    return TypePropertyName;
};
