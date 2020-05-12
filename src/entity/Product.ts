import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn} from "typeorm";

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
    
    @Column("varchar", {length: 127})
    catagory: string;

    

    @Column("int", { nullable: false })
    typeId: number;

    @ManyToOne(() => ProductType, type => type.products, { cascade: true })
    @JoinColumn({ name: "typeId" })
    type: Promise<ProductType>;

    @OneToMany(() => Stock, stock => stock.product)
    stock:  Promise<Stock[]>;

    @OneToMany(() => ProductPropertyValue, productPropertyValue => productPropertyValue.product, { cascade: true })
    productPropertyValues:  Promise<ProductPropertyValue[]>;

}
