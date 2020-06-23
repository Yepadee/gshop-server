import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, OneToOne, JoinColumn, AfterInsert, BeforeInsert} from "typeorm";

import {Product} from "./Product";

import {PropertyName} from "./PropertyName";
import { Category } from "./Category";

import { getManager } from "typeorm";

@Entity()
export class ProductType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 127, unique: true})
    name: string;

    @OneToMany(() => Product, product => product.type)
    products: Promise<Product[]>;

    @ManyToMany(() => PropertyName, propertyName => propertyName.productTypes)
    propertyNames: Promise<PropertyName[]>;

    @Column("int")
    rootCategoryId: number;

    @OneToOne(() => Category)
    @JoinColumn()
    rootCategory: Promise<Category>;

    @BeforeInsert()
    async addRootCategory() {
        const rootCategory = new Category();
        rootCategory.name = "root-" + this.name + "-category"; 
        const result = await getManager().save(rootCategory);
        this.rootCategory = <any>{id: result.id};
    }

}
