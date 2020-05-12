import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";

import {Product} from "@entity/Product";

import {ProductPropertyName} from "./ProductPropertyName";

@Entity()
export class ProductPropertyValue {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 255})
    value: string;

    @ManyToOne(() => Product, product => product.productPropertyValues)
    product: Product;

    @ManyToOne(() => ProductPropertyName, productPropertyName => productPropertyName.propertyValues)
    propertyName: ProductPropertyName; 

}
