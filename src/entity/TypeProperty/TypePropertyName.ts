import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";

import { ProductType } from "@entity/ProductType";
import { TypePropertyValue } from "./TypePropertyValue";

@Entity()
export class TypePropertyName {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 255})
    name: string;

    @ManyToOne(() => ProductType, productType => productType.typePropertyNames, { cascade: true })
    productType: ProductType;

    @OneToMany(() => TypePropertyValue, propertyValue => propertyValue.propertyName, { cascade: true })
    propertyValues: ProductType;

}
