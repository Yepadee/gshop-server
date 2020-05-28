import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, JoinColumn, OneToMany } from "typeorm";
import { Min } from "class-validator";

import { Product } from "./Product";
import { PropertyValue } from "./PropertyValue";
import { OrderItem } from "./OrderItem";

@Entity()
export class Stock {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("int")
    @Min(0)
    quantity: number;

    @Column("int")
    productId: number;

    @ManyToOne(() => Product, product => product.stock)
    @JoinColumn({ name: "productId" })
    product: Promise<Product>;

    @ManyToMany(() => PropertyValue, propertyValue => propertyValue.stock)
    @JoinTable({name: "stock_properties"})
    properties: Promise<PropertyValue[]>;

    @OneToMany(() => OrderItem, orderItem => orderItem.stock)
    orders: Promise<OrderItem[]>;
}
