import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinColumn} from "typeorm";

import {PropertyName} from "./PropertyName";
import { Stock } from "./Stock";

@Entity()
export class PropertyValue {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 255})
    value: string;

    @Column("int", { nullable: false })
    propertyNameId: number

    @ManyToOne(() => PropertyName, propertyName => propertyName.propertyValues)
    @JoinColumn({ name: "propertyNameId" })
    propertyName: Promise<PropertyName>;

    @ManyToMany(() => Stock, stock => stock.properties, {cascade: true})
    stock: Promise<Stock[]>;

}
