import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";

import {ProductType} from "../ProductType";

@Entity()
export class TypePropertyName {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 255})
    name: string;

    @ManyToOne(() => ProductType, productType => productType.typePropertyNames)
    productType: ProductType;

}
