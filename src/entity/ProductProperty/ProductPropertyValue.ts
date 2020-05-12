import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";

import {Product} from "@entity/Product";

import {ProductPropertyName} from "./ProductPropertyName";


@Entity()
export class ProductPropertyValue {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 255})
    value: string;

    @Column("int", { nullable: false })
    productId: string;

    @ManyToOne(() => Product, product => product.productPropertyValues)
    @JoinColumn({ name: "productId" })
    product: Product;

    @ManyToOne(() => ProductPropertyName, productPropertyName => productPropertyName.propertyValues)
    propertyName: ProductPropertyName; 

}
