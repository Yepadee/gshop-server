import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class TypePropertyValue {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 255})
    value: string; 

}
