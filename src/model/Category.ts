import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Tree, TreeChildren, TreeParent } from "typeorm";
import { Product } from "./Product";

@Entity()
@Tree("closure-table")
export class Category {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 255})
    name: string;

    @Column({nullable: true})
    parentId: number;

    @TreeParent()
    parent: Promise<Category>;

    @TreeChildren()
    children: Promise<Category[]>;

    @OneToMany(() => Product, product => product.category)
    products: Promise<Product[]>;
}
