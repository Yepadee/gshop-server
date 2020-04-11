export default (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        perms: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['admin', 'assistant']]
            }
        }
    });

    return User;
};