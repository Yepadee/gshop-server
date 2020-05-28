import { Entity, PrimaryColumn, OneToOne, JoinColumn, ManyToOne, Column, OneToMany } from "typeorm";

import { Customer } from "@entity/Customer";
import { Address } from "@entity/Address";
import { OrderItem } from "./OrderItem";

@Entity()
export class Order {

    @PrimaryColumn()
    id: string;

    @ManyToOne(() => Customer, customer => customer.orders)
    @JoinColumn()
    customer: Customer

    @OneToOne(() => Address, { cascade: true, persistence: true })
    @JoinColumn()
    address: Address

    @OneToMany(() => OrderItem, orderitem => orderitem.order, { cascade: true, persistence: true })
    items: Promise<OrderItem[]>

    @Column({type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    date: Date

    @Column("varchar", {length: 127, default: () => "'NEW'"})
    status: string
    
}