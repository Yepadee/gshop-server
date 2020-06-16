import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "./Product";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 255})
    name: string;

    @ManyToOne(() => Category, category => category.children, { cascade: true })
    @JoinColumn()
    parent: Promise<Category>;

    @OneToMany(() => Category, category => category.parent)
    children:  Promise<Category[]>;

    @OneToMany(() => Product, product => product.category)
    products:  Promise<Product[]>;
}
