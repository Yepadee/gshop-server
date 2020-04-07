export default (sequelize, DataTypes) => {
    const TypePropertyName = sequelize.define('typePropertyName', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    TypePropertyName.associate = (models) => {
        TypePropertyName.belongsTo(models.ProductType);
        TypePropertyName.hasMany(models.TypePropertyValue, { onDelete: 'cascade' });
    };

    return TypePropertyName;
};
