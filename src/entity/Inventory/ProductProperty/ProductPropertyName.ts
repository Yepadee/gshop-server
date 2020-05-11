import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class ProductPropertyName {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 255})
    name: string; 

}
