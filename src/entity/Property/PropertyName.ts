import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";

import { ProductType } from "@entity/ProductType";
import { PropertyValue } from "./PropertyValue";

@Entity()
export class PropertyName {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 255})
    name: string;

    @ManyToOne(() => ProductType, productType => productType.propertyNames)
    productType: Promise<ProductType>;

    @OneToMany(() => PropertyValue, propertyValue => propertyValue.propertyName, { cascade: true })
    propertyValues: Promise<PropertyValue>;

}
