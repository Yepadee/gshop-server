import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 255})
    username: string;

    @Column("varchar", {length: 255})
    password: string;
}