import { Entity, PrimaryColumn, OneToOne, JoinColumn, ManyToOne, Column } from "typeorm";

import { Customer } from "@entity/Customer";
import { Address } from "@entity/Address";

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

    @Column({type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    date: Date

    @Column("varchar", {length: 127, default: () => "'NEW'"})
    status: string
    
}