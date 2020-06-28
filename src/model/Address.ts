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
    countryCode: CountryCode;

    @Column("varchar", {length: 63})
    postalCode: string;
    
    @Column("varchar", {length: 127})
    line1: string;

    @Column("varchar", {length: 127})
    line2: string;

    @Column("varchar", {length: 127})
    line3: string;

    @Column("varchar", {length: 127})
    line4: string;

}