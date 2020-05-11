import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

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

}
