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

    ProductPropertyName: sequelize.import('./productPropertyName'),
    ProductPropertyValue: sequelize.import('./productPropertyValue'),

    TypePropertyName: sequelize.import('./typePropertyName'),
    TypePropertyValue: sequelize.import('./typePropertyValue')
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
            productType.createProductPropertyName({
                name: 'colour'
            });
            productType.createTypePropertyName({
                name: 'size'
            });
            
            db.TypePropertyValue.create({
                value: 'S',
                typePropertyNameId: 1
            });

            db.TypePropertyValue.create({
                value: 'M',
                typePropertyNameId: 1
            });

            db.TypePropertyValue.create({
                value: 'L',
                typePropertyNameId: 1
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
                product.createProductPropertyValue({
                    value: "red",
                    productPropertyNameId: 1
                });

                product.createProductPropertyValue({
                    value: "green",
                    productPropertyNameId: 1
                });

                product.createProductPropertyValue({
                    value: "blue",
                    productPropertyNameId: 1
                });

                //Make a stock for each colour
                product.createStock({
                    quantity: Faker.commerce.price(),
                }).then((stock) => {
                    stock.addTypePropertyValue(1);
                    return stock.addProductPropertyValue(3 * (product.id - 1) + 1)
                });

                product.createStock({
                    quantity: Faker.commerce.price(),
                }).then((stock) => {
                    stock.addTypePropertyValue(2);
                    return stock.addProductPropertyValue(3 * (product.id - 1) + 2)
                });

                return product.createStock({
                        quantity: Faker.commerce.price(),
                    }).then((stock) => {
                        stock.addTypePropertyValue(3);
                        return stock.addProductPropertyValue(3 * (product.id - 1) + 3)
                    })
                });
            });
        }) 
    }
);

export default sequelize;