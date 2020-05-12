import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, JoinColumn} from "typeorm";

import {Product} from "./Product";
import { ProductPropertyValue } from "./ProductProperty/ProductPropertyValue";
import { TypePropertyValue } from "./TypeProperty/TypePropertyValue";

@Entity()
export class Stock {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("int")
    quantity: number;

    @Column("int")
    productId: number;

    @ManyToOne(() => Product, product => product.stock)
    @JoinColumn({ name: "productId" })
    product: Promise<Product>;

    @ManyToMany(() => ProductPropertyValue)
    @JoinTable({name: "stock_product_properties"})
    productPropertyValues: Promise<ProductPropertyValue[]>;

    @ManyToMany(() => TypePropertyValue)
    @JoinTable({name: "stock_type_properties"})
    typePropertyValues: Promise<TypePropertyValue[]>;
}
