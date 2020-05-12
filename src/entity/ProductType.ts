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

    @OneToMany(() => Product, product => product.type)
    products: Promise<Product[]>;

    @OneToMany(() => ProductPropertyName, productPropertyName => productPropertyName.productType, { cascade: true })
    productPropertyNames: Promise<ProductPropertyName[]>;

    @OneToMany(() => TypePropertyName, typePropertyName => typePropertyName.productType, { cascade: true })
    typePropertyNames: Promise<TypePropertyName[]>;

}
