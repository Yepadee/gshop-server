import { Entity, PrimaryColumn, OneToOne, JoinColumn, ManyToOne, Column, OneToMany } from "typeorm";

import { Customer } from "@entity/Customer";
import { Address } from "@entity/Address";
import { OrderItem } from "./OrderItem";

@Entity()
export class Order {

    @PrimaryColumn()
    id: string;

    @Column({type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    date: Date

    @Column("varchar", {length: 127, default: () => "'NEW'"})
    status: string


    @ManyToOne(() => Customer, customer => customer.orders)
    @JoinColumn()
    customer: Promise<Customer>

    @OneToOne(() => Address, { cascade: true, persistence: true })
    @JoinColumn()
    address: Promise<Address>

    @OneToMany(() => OrderItem, orderitem => orderitem.order, { cascade: true, persistence: true })
    items: Promise<OrderItem[]>

}