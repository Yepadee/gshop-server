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

    @ManyToOne(() => Product, product => product.stock)
    product: Product;

    @ManyToMany(() => ProductPropertyValue)
    @JoinTable()
    productPropertyValues: ProductPropertyValue[];

    @ManyToMany(() => TypePropertyValue)
    @JoinTable()
    typePropertyValues: TypePropertyValue[];
}
