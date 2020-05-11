import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class ProductType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 127})
    name: string;

}
