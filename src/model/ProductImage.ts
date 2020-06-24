import { PrimaryGeneratedColumn, Entity, Column, ManyToOne } from "typeorm";
import { Min } from "class-validator";
import { Product } from "./Product";

@Entity()
export class ProductImage {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 255})
    path: string;

    @Min(0)
    @Column()
    priority: number;

    @Column()
    productId: number;

    @ManyToOne(() => Product, product => product.images)
    product: Promise<Product>;
}