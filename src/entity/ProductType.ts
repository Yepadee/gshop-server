import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";

import {Product} from "./Product";

import {PropertyName} from "./Property/PropertyName";

@Entity()
export class ProductType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 127})
    name: string;

    @OneToMany(() => Product, product => product.type)
    products: Promise<Product[]>;

    @OneToMany(() => PropertyName, propertyName => propertyName.productType, { cascade: true })
    propertyNames: Promise<PropertyName[]>;

}
