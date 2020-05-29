import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { Order } from "./Order";

@Entity()
export class Customer {

    @PrimaryColumn()
    id: string;

    @Column("varchar", {length: 127})
    firstName: string;

    @Column("varchar", {length: 127})
    lastName: string;

    @Column("varchar", {length: 255})
    email: string;

    @OneToMany(() => Order, order => order.customer)
    orders: Promise<Order[]>;
}