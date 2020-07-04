import { EntityRepository, Repository } from "typeorm";
import { Collection } from "@entity/Collection";


@EntityRepository(Collection)
export class OrderItemRepository extends Repository<Collection> {

    async insertCollection(name: string) {
        const collection = new Collection();
        collection.name = name;
        return this.save(collection).then(() => {
            return true;
        });
    }

    async addProduct(id: number, productId: number) {
        return this.createQueryBuilder()
        .relation(Collection, "products")
        .of(id)
        .add(productId).then(() => {
            return true;
        });
    }

    async removeProduct(id: number, productId: number) {
        return this.createQueryBuilder()
        .relation(Collection, "products")
        .of(id)
        .remove(productId).then(() => {
            return true;
        });
    }

    async deleteCollection(id: number) {
        return this.delete(id).then(() => {
            return true;
        });
    }
}