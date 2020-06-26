import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, ManyToMany, JoinTable, AfterInsert} from "typeorm";

import { ProductType } from "./ProductType";
import { Stock } from "./Stock";
import { Category } from "./Category";
import { PropertyName } from "./PropertyName";

import * as fs from "fs";
import { ProductImage } from "./ProductImage";

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 255})
    name: string;

    @Column("varchar", {length: 512, nullable: true})
    description: string;

    @Column("decimal", { precision: 5, scale: 2 })
    price: number;

    @Column("int", {default: false})
    published: boolean;

    @Column({type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date;

    @Column("int")
    typeId: number;

    @ManyToOne(() => ProductType, type => type.products, { cascade: true })
    @JoinColumn()
    type: Promise<ProductType>;

    @ManyToMany(() => PropertyName)
    @JoinTable({name: "product_required_properties"})
    requiredProperties: Promise<PropertyName[]>;

    @OneToMany(() => Stock, stock => stock.product)
    stock:  Promise<Stock[]>;

    @Column("int")
    categoryId: number;

    @ManyToOne(() => Category, category => category.products)
    category: Promise<Category>;

    @OneToMany(() => ProductImage, image => image.product, {cascade: true})
    images:  Promise<ProductImage[]>;

    @AfterInsert()
    createImageFolder() {
        const imageDir = "public/product-images/" + this.id;
        if (!fs.existsSync(imageDir)) {
            fs.mkdirSync(imageDir, { recursive: true });
        }
    }
}
