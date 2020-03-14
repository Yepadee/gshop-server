Sequelize = require('Sequelize');
_ = require('lodash');
Faker = require('faker');

const Conn = new Sequelize(
    'nodemysql',
    'root',
    'yoloswag69',
    {
        dialect: 'mysql',
        host: 'localhost'
    }
);

const Product = Conn.define('product', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    price: {
        type: Sequelize.DECIMAL,
        allowNull: false
    },
    discount: {
        type: Sequelize.DECIMAL,
        allowNull: false
    }
});

const Stock = Conn.define('stock', {
    quantity: {
        type: Sequelize.INTEGER
    }
});

const StockProperty = Conn.define('stockProperty', {
    key: {
        type: Sequelize.STRING,
        allowNull: false
    },
    value: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Product.hasMany(Stock);
Stock.belongsTo(Product);

Stock.hasMany(StockProperty);
StockProperty.belongsTo(Stock);

Conn.sync({force: true}).then(() => {
    _.times(10, () => {
        return Product.create({
            name: Faker.commerce.productName(),
            description: Faker.commerce.productAdjective(),
            price: Faker.commerce.price(),
            discount: 0.0
        }).then( product => {
            return product.createStock({
                quantity: Faker.commerce.price()
            }).then( stock => {
                stock.createStockProperty({
                    key: "colour",
                    value: Faker.commerce.color()
                })
                return stock.createStockProperty({
                    key: "size",
                    value: "m"
                })
            })
        });
    })
});

module.exports = Conn;