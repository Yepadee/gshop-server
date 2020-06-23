import { PropertyName } from "@entity/PropertyName";
import { PropertyValue } from "@entity/PropertyValue";
import { User } from "@entity/User";
import { ProductType } from "@entity/ProductType";
import { Product } from "@entity/Product";
import { Stock } from "@entity/Stock";

import * as _ from "lodash";
import * as faker from "faker";
import * as bcrypt from "bcrypt";
import { Category } from "@entity/Category";


export const setup = async (connection) => {
    const user = new User();
    user.username = "Admin";
    user.password = await bcrypt.hash("password", 10);
    await connection.manager.save(user);

    const propertyName = new PropertyName();
    propertyName.name = "Size";
    await connection.manager.save(propertyName);

    const v1 = new PropertyValue();
    v1.value = "Small";
    v1.propertyName = <any>{id:1};
    await connection.manager.save(v1);

    const v2 = new PropertyValue();
    v2.value = "Medium";
    v2.propertyName = <any>{id:1};
    await connection.manager.save(v2);

    const v3 = new PropertyValue();
    v3.value = "Large";
    v3.propertyName = <any>{id:1};
    await connection.manager.save(v3);

    const propertyName2 = new PropertyName();
    propertyName2.name = "Colour";
    await connection.manager.save(propertyName2);

    const v4 = new PropertyValue();
    v4.value = "Red";
    v4.propertyName = <any>{id:2};
    await connection.manager.save(v4);

    const v5 = new PropertyValue();
    v5.value = "Green";
    v5.propertyName = <any>{id:2};
    await connection.manager.save(v5);

    const v6 = new PropertyValue();
    v6.value = "Blue";
    v6.propertyName = <any>{id:2};
    await connection.manager.save(v6);

    let productType = new ProductType();
    productType.name = "Clothing";
    productType.propertyNames = <any>[{id:1}, {id:2}];
    productType = await connection.manager.save(productType);

    const category1 = new Category();
    category1.name = "Tops";
    category1.parent = productType.rootCategory;
    await connection.manager.save(category1);

    const category2 = new Category();
    category2.name = "Leggings";
    category2.parent =  productType.rootCategory;
    await connection.manager.save(category2);

    const category3 = new Category();
    category3.name = "T-Shirts";
    category3.parent = <any>category1;
    await connection.manager.save(category3);

    const category4 = new Category();
    category4.name = "Hoodies";
    category4.parent = <any>category1;
    await connection.manager.save(category4);

    const category5 = new Category();
    category5.name = "Jeans";
    category5.parent = <any>category2;
    await connection.manager.save(category5);

    const category6 = new Category();
    category6.name = "Skirts";
    category6.parent = <any>category2;
    await connection.manager.save(category6);

    _.times(20, async () => {
    const product = new Product();
    product.name = faker.commerce.product();
    product.description = faker.commerce.productAdjective();
    product.price = faker.random.number({ max: 1, min: 30 });
    product.type = <any>{id:1};
    product.requiredProperties = <any>[{id:1}, {id:2}];
    product.published = true;
    await connection.manager.save(product);
    const s1 = new Stock();
    s1.quantity = faker.random.number({ max: 1, min: 30 });
    s1.sales = faker.random.number({ max: 1, min: 30 });
    s1.product = <any>product;
    s1.properties = <any>[{id:1}, {id:4}];
    await connection.manager.save(s1);
    const s2 = new Stock();
    s2.quantity = faker.random.number({ max: 1, min: 30 });
    s2.sales = faker.random.number({ max: 1, min: 30 });
    s2.product = <any>product;
    s2.properties = <any>[{id:2}, {id:5}];
    await connection.manager.save(s2);
    const s3 = new Stock();
    s3.quantity = faker.random.number({ max: 3, min: 30 });
    s3.sales = faker.random.number({ max: 1, min: 30 });
    s3.product = <any>product;
    s3.properties = <any>[{id:1}, {id:6}];
    await connection.manager.save(s3);
    });
}