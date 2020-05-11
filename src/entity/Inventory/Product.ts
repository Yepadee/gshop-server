import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";

import {ProductType} from "./ProductType";
import {Stock} from "./Stock";
import { ProductPropertyValue } from "./ProductProperty/ProductPropertyValue";

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 255})
    name: string;

    @Column("varchar", {length: 512})
    description: string;

    @Column("decimal", { precision: 5, scale: 2 })
    price: number; 
    
    
    @ManyToOne(type => ProductType, type => type.products)
    type: ProductType;

    @OneToMany(type => Stock, stock => stock.product)
    stock: Stock[];

    @OneToMany(type => ProductPropertyValue, productPropertyValue => productPropertyValue.products)
    productPropertyValues: ProductPropertyValue[];

}
