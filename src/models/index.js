import Sequelize from 'sequelize';
import _ from 'lodash';
import Faker from 'faker';

const sequelize = new Sequelize(
    'gshop-db',
    'root',
    'yoloswag69',
    {
        dialect: 'mysql',
        host: 'localhost'
    }
);

const db = {
    ProductType: sequelize.import('./productType'),
    Product: sequelize.import('./product'),
    Stock: sequelize.import('./stock'),
    PropertyName: sequelize.import('./propertyName'),
    PropertyValue: sequelize.import('./propertyValue')
};

Object.keys(db).forEach((modelName) => {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

sequelize.sync({force: true}).then(
    () => {
        return db.ProductType.create({
            name: "clothing"
        }).then((productType) => {
            productType.createPropertyName({
                name: 'colour'
            }).then((propertyName) => {
                propertyName.createPropertyValue({
                    value: 'red'
                });
                propertyName.createPropertyValue({
                    value: 'green'
                });
                propertyName.createPropertyValue({
                    value: 'blue'
                });
            });
            productType.createPropertyName({
                name: 'size'
            }).then((propertyName) => {
                propertyName.createPropertyValue({
                    value: 'small'
                });
                propertyName.createPropertyValue({
                    value: 'medium'
                });
                propertyName.createPropertyValue({
                    value: 'large'
                });
            });
            _.times(10, () => {  
                return db.Product.create({
                    name: Faker.commerce.product(),
                    description: Faker.commerce.productAdjective(),
                    price: Faker.commerce.price(.10,5.00,2),
                    discount: 0.0,
                    catagory: 'hoodie',
                    productTypeId: 1
            }).then((product) => {
                product.addPropertyValue(1)
                product.addPropertyValue(2)
                product.addPropertyValue(3)
                product.addPropertyValue(4)
                product.addPropertyValue(5)
                product.addPropertyValue(6)

                product.createStock({
                    quantity: Faker.commerce.price(),
                }).then((stock) => {
                    //Make sure this is valid
                    stock.addPropertyValue(2)
                    stock.addPropertyValue(4)
                })

                return product.createStock({
                        quantity: Faker.commerce.price(),
                    }).then((stock) => {
                        //Make sure this is valid
                        stock.addPropertyValue(1)
                        return stock.addPropertyValue(5)
                    })
                });
            });
        }) 
    }
);

export default sequelize;