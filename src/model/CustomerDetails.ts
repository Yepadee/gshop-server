import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class CustomerDetails {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 127})
    firstName: string;

    @Column("varchar", {length: 127})
    secondName: string;

    @Column("varchar", {length: 127})
    email: string;

    @Column("varchar", {length: 127, nullable: true})
    phonenumber: string;

}