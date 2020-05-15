import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable} from "typeorm";

import { ProductType } from "@entity/ProductType";
import { PropertyValue } from "./PropertyValue";

@Entity()
export class PropertyName {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 255})
    name: string;

    @ManyToMany(() => ProductType, productType => productType.propertyNames)
    @JoinTable({name: "property_name_types"})
    productTypes: Promise<ProductType[]>;

    @OneToMany(() => PropertyValue, propertyValue => propertyValue.propertyName, { cascade: true })
    propertyValues: Promise<PropertyValue>;

}
