import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany} from "typeorm";

import {PropertyName} from "./PropertyName";
import { Stock } from "@entity/Stock";

@Entity()
export class PropertyValue {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 255})
    value: string; 

    @ManyToOne(() => PropertyName, propertyName => propertyName.propertyValues)
    propertyName: Promise<PropertyName>;

    @ManyToMany(() => Stock, stock => stock.properties)
    stock: Promise<Stock[]>;

}
