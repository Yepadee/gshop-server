import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";

import {ProductType} from "../ProductType";

@Entity()
export class ProductPropertyName {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 255})
    name: string; 

    @ManyToOne(type => ProductType, productType => productType.typePropertyNames)
    productType: ProductType;

}
