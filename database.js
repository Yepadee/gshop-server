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
    },
    catagory: {
        type: Sequelize.STRING,
        allowNull: false
    },
    productTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

const Stock = Conn.define('stock', {
    quantity: {
        type: Sequelize.INTEGER
    }
});

const ProductType = Conn.define('productType', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

const TypeProperty = Conn.define('typeProperty', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

const PropertyValue = Conn.define('propertyValue', {
    value: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Product.hasMany(Stock);
Stock.belongsTo(Product);

ProductType.hasMany(Product, { foreignKey: 'productTypeId' });
Product.belongsTo(ProductType, { foreignKey: 'productTypeId' });

ProductType.hasMany(TypeProperty);
TypeProperty.belongsTo(ProductType);

TypeProperty.hasMany(PropertyValue);
PropertyValue.belongsTo(TypeProperty);

Stock.belongsToMany(PropertyValue, { through: 'StockProperties'});
PropertyValue.belongsToMany(Stock, { through: 'StockProperties'});

Product.belongsToMany(PropertyValue, { through: 'ProductProperties'});
PropertyValue.belongsToMany(Product, { through: 'ProductProperties'});


Conn.sync({force: true}).then(
    () => {
        return ProductType.create({
            name: "clothing"
        }).then((productType) => {
            productType.createTypeProperty({
                name: 'colour'
            }).then((typeProperty) => {
                typeProperty.createPropertyValue({
                    value: 'red'
                });
                typeProperty.createPropertyValue({
                    value: 'green'
                });
                typeProperty.createPropertyValue({
                    value: 'blue'
                });
            });
            productType.createTypeProperty({
                name: 'size'
            }).then((typeProperty) => {
                typeProperty.createPropertyValue({
                    value: 'small'
                });
                typeProperty.createPropertyValue({
                    value: 'medium'
                });
                typeProperty.createPropertyValue({
                    value: 'large'
                });
            });
            _.times(10, () => {  
                return Product.create({
                    name: Faker.commerce.productName(),
                    description: Faker.commerce.productAdjective(),
                    price: Faker.commerce.price(.10,5.00,2),
                    discount: 0.0,
                    catagory: 'hoodie',
                    productTypeId: 1
            }).then((product) => {
                product.addPropertyValue(1)
                product.addPropertyValue(4)
                return product.createStock({
                        quantity: Faker.commerce.price(),
                    }).then((stock) => {
                        //Make sure this is valid
                        stock.addPropertyValue(1)
                        return stock.addPropertyValue(4)
                    })
                });
            });
        }) 
    }
);

module.exports = Conn;