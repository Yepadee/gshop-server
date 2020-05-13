import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";

import {PropertyName} from "./PropertyName";

@Entity()
export class PropertyValue {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 255})
    value: string; 

    @ManyToOne(() => PropertyName, propertyName => propertyName.propertyValues)
    propertyName: Promise<PropertyName>; 

}
