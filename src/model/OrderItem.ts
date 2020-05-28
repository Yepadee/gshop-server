import { Entity, ManyToOne, Column } from "typeorm";
import { Stock } from "./Stock";
import { Min } from "class-validator";
import { Order } from "./Order";

@Entity()
export class OrderItem {
    @ManyToOne(() => Order, order => order.items, { primary: true })
    order: Order

    @ManyToOne(() => Stock, stock => stock.orders, { primary: true })
    stock: Stock

    @Column("int")
    @Min(1)
    quantity: number;

}