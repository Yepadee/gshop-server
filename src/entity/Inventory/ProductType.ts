import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";

import {Product} from "./Product";

import {ProductPropertyName} from "./ProductProperty/ProductPropertyName";
import {TypePropertyName} from "./TypeProperty/TypePropertyName";

@Entity()
export class ProductType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 127})
    name: string;

    @OneToMany(type => Product, product => product.type)
    products: Product[];

    @OneToMany(type => ProductPropertyName, productPropertyName => productPropertyName.productType)
    productPropertyNames: ProductPropertyName[];

    @OneToMany(type => TypePropertyName, typePropertyName => typePropertyName.productType)
    typePropertyNames: TypePropertyName[];

}
