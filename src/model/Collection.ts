import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from "typeorm";

import {Product} from "./Product";

@Entity()
export class Collection {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 127, unique: true})
    name: string;

    @ManyToMany(() => Product, product => product.collections)
    @JoinTable({ name:"collection_products" })
    products: Promise<Product[]>;

}
