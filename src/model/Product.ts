import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, ManyToMany, JoinTable, AfterInsert} from "typeorm";

import { ProductType } from "./ProductType";
import { Stock } from "./Stock";
import { PropertyName } from "./PropertyName";

import * as fs from "fs";

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

    @Column("bool", {default: false})
    published: boolean;

    @Column("int", { nullable: false })
    typeId: number;

    @ManyToOne(() => ProductType, type => type.products, { cascade: true })
    @JoinColumn({ name: "typeId" })
    type: Promise<ProductType>;

    @ManyToMany(() => PropertyName)
    @JoinTable({name: "product_required_properties"})
    requiredProperties: Promise<PropertyName[]>;

    @OneToMany(() => Stock, stock => stock.product)
    stock:  Promise<Stock[]>;

    @AfterInsert()
    createImageFolder() {
        const imageDir = "public/product-images/" + this.id;
        if (!fs.existsSync(imageDir)) {
            fs.mkdirSync(imageDir, { recursive: true });
        }
    }
}
