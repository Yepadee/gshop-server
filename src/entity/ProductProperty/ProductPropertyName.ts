import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";

import {ProductType} from "@entity/ProductType";

import {ProductPropertyValue} from "./ProductPropertyValue";

@Entity()
export class ProductPropertyName {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 255})
    name: string; 

    @ManyToOne(() => ProductType, productType => productType.typePropertyNames, { cascade: true })
    productType: ProductType;

    @OneToMany(() => ProductPropertyValue, propertyValue => propertyValue.propertyName, { cascade: true })
    propertyValues: ProductType;

}
