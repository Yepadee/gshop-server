import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany} from "typeorm";

import {Product} from "./Product";

import {PropertyName} from "./Property/PropertyName";

@Entity()
export class ProductType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 127, unique: true})
    name: string;

    @OneToMany(() => Product, product => product.type)
    products: Promise<Product[]>;

    @ManyToMany(() => PropertyName, propertyName => propertyName.productTypes)
    propertyNames: Promise<PropertyName[]>;

}
