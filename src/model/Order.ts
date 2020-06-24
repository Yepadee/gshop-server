import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { OrderItem } from "./OrderItem";

export enum PaymentMethod {
    PAYPAL = 'PAYPAL',
    FLUTTERWAVE = 'FLUTTERWAVE'
}

export enum OrderStatus {
    NEW = 'NEW',
    PROCESSED = 'PROCESSED',
    ARRIVED = 'ARRIVED'
}

@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column("varchar", {length: 127})
    orderId: string;

    @Column("varchar", {length: 16})
    paymentMethod: PaymentMethod;

    @OneToMany(() => OrderItem, orderitem => orderitem.order, { cascade: true, persistence: true })
    items: Promise<OrderItem[]>;

    @Column("varchar", {length: 127, nullable: true})
    supplierOrderId: string;

    @Column({type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    date: Date;

    @Column("varchar", {length: 127, default: () => "'NEW'"})
    status: string;
}