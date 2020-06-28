import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

export enum CountryCode {
    US = 'US',
    GB = 'GB'
}

@Entity()
export class Address {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 127})
    name: string;

    @Column("varchar", {length: 127})
    countryCode: CountryCode;

    @Column("varchar", {length: 63, nullable:true})
    postalCode: string;
    
    @Column("varchar", {length: 127})
    line1: string;

    @Column("varchar", {length: 127, nullable:true})
    line2: string;

    @Column("varchar", {length: 127})
    adminArea2: string;

    @Column("varchar", {length: 127, nullable:true})
    adminArea1: string;

}