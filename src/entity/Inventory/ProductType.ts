import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";

import {Product} from "./Product";

@Entity()
export class ProductType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 127})
    name: string;

    @OneToMany(type => Product, product => product.type)
    products: Product[];

}
