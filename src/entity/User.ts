import {Entity, PrimaryColumn, Column, BeforeInsert} from "typeorm";
import * as uuidv4 from 'uuid/v4';

@Entity()
export class ProductType {

    @PrimaryColumn("uuid")
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

    @BeforeInsert()
    addId() {
        this.id = uuidv4();
    }

}
