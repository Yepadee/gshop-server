import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable} from "typeorm";

import {Product} from "./Product";
import { ProductPropertyValue } from "./ProductProperty/ProductPropertyValue";
import { TypePropertyValue } from "./TypeProperty/TypePropertyValue";

@Entity()
export class Stock {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("int")
    quantity: number;  

    @ManyToOne(type => Product, product => product.stock)
    product: Product;

    @ManyToMany(type => ProductPropertyValue)
    @JoinTable()
    productPropertyValues: ProductPropertyValue[];

    @ManyToMany(type => TypePropertyValue)
    @JoinTable()
    typePropertyValues: TypePropertyValue[];
}
