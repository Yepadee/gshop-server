import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 255, unique: true})
    username: string;

    @Column("varchar", {length: 255})
    password: string;
}