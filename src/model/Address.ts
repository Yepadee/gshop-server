import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { Order } from "./Order";


@Entity()
export class Address {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 255})
    addressLine1: string;

    @Column("varchar", {length: 255, nullable: true})
    addressLine2: string;

    @Column("varchar", {length: 255})
    adminArea1: string;

    @Column("varchar", {length: 255, nullable: true})
    adminArea2: string;

    @Column("varchar", {length: 127})
    postalCode: string;

    @Column("varchar", {length: 7})
    countryCode: string;

}