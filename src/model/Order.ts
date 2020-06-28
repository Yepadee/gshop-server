import { Entity, Column, OneToMany, PrimaryGeneratedColumn, PrimaryColumn, BeforeInsert } from "typeorm";

import { OrderItem } from "./OrderItem";

import { uuid } from "uuidv4";

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

    @BeforeInsert()
    setId() {
        this.id = uuid();
    }
}