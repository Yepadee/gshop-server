import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";

import {Product} from "../Product";

@Entity()
export class ProductPropertyValue {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 255})
    value: string;

    @ManyToOne(() => Product, product => product.productPropertyValues)
    product: Product;

}
