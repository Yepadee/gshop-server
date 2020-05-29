import { Entity, ManyToOne, Column, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { Stock } from "./Stock";
import { Min } from "class-validator";
import { Order } from "./Order";

@Entity()
export class OrderItem {
    
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, order => order.items)
    @JoinColumn()
    order: Promise<Order>

    @ManyToOne(() => Stock, stock => stock.orders)
    @JoinColumn()
    stock: Promise<Stock>

    @Column("int")
    @Min(1)
    quantity: number;

}