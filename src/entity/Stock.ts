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
    @JoinTable({name: "stock_product_properties"})
    productPropertyValues: ProductPropertyValue[];

    @ManyToMany(() => TypePropertyValue)
    @JoinTable({name: "stock_type_properties"})
    typePropertyValues: TypePropertyValue[];
}
