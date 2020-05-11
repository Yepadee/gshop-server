import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";

import {TypePropertyName} from "./TypePropertyName";

@Entity()
export class TypePropertyValue {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 255})
    value: string; 

    @ManyToOne(() => TypePropertyName, typePropertyName => typePropertyName.propertyValues)
    propertyName: TypePropertyName; 

}
