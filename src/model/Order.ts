import { Entity, Column, OneToMany, PrimaryColumn, BeforeInsert } from "typeorm";

import { uuid } from "uuidv4";

import { OrderItem } from "./OrderItem";

export enum PaymentMethod {
    PAYPAL = 'PAYPAL',
    FLUTTERWAVE = 'FLUTTERWAVE'
}

export enum OrderStatus {
    UNCONFIRMED = 'UNCONFIRMED',
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
    paymentOrderRef: string;

    @Column("varchar", {length: 127, nullable: true})
    paymentTransactionId: string;

    @Column("varchar", {length: 127, nullable: true})
    supplierOrderId: string;

    @Column("varchar", {length: 16})
    paymentMethod: PaymentMethod;

    @Column("decimal", { precision: 5, scale: 2 })
    amountPaid: number;

    @Column("varchar", {length: 4})
    currencyPaid: string;

    @Column({nullable: true})
    supplierCost: number;

    @OneToMany(() => OrderItem, orderitem => orderitem.order, { cascade: true, persistence: true })
    items: Promise<OrderItem[]>;

    @Column({type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    dateCreated: Date;

    @Column({type: "datetime", nullable: true})
    dateConfirmed: Date;

    @Column("varchar", {length: 127, default: () => "'UNCONFIRMED'"})
    status: string;

    @BeforeInsert()
    setId() {
        this.id = uuid();
    }
}