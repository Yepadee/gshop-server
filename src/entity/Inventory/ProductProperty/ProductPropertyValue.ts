import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class ProductPropertyValue {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 255})
    value: string; 

}
