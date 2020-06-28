import { Entity, Column, OneToMany, PrimaryColumn, BeforeInsert, OneToOne, JoinColumn } from "typeorm";

import { uuid } from "uuidv4";

import { OrderItem } from "./OrderItem";
import { Address } from "./Address";

export enum PaymentMethod {
    PAYPAL = 'PAYPAL',
    FLUTTERWAVE = 'FLUTTERWAVE'
}

export enum OrderStatus {
    NEW = 'NEW',
    PROCESSED = 'PROCESSED',
    ARRIVED = 'ARRIVED',
    REFUNDED = 'REFUNDED'
}

@Entity()
export class Order {

    @PrimaryColumn()
    id: string;
    
    @Column("varchar", {length: 127})
    paymentOrderId: string;

    @Column("varchar", {length: 127, nullable: true})
    supplierOrderId: string;

    @Column("varchar", {length: 16})
    paymentMethod: PaymentMethod;

    @OneToOne(_ => Address, {cascade: true})
    @JoinColumn()
    shippingAddress: Address;

    @OneToMany(() => OrderItem, orderitem => orderitem.order, { cascade: true, persistence: true })
    items: Promise<OrderItem[]>;

    @Column({type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    date: Date;

    @Column("varchar", {length: 127, default: () => "'NEW'"})
    status: string;

    @BeforeInsert()
    setId() {
        this.id = uuid();
    }
}