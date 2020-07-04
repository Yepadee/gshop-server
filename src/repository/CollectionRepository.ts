import { EntityRepository, Repository } from "typeorm";
import { Collection } from "@entity/Collection";


@EntityRepository(Collection)
export class CollectionRepository extends Repository<Collection> {
    getCollections(args) {
        return this.find({where: args});
    }

    getCollectionById(id: number) {
        return this.find({where: { id }});
    }

    insertCollection(name: string) {
        const collection = new Collection();
        collection.name = name;
        return this.save(collection).then(() => {
            return true
        });
    }

    updateCollection(args) {
        return this.createQueryBuilder("collections")
        .update(Collection)
        .set({name: args.name})
        .where("category.id = :id", { id: args.id })
        .execute().then(() => {
            return true;
        })
    }

    deleteCollection(id: number) {
        return this.delete(id).then(() => {
            return true;
        });
    }

    addProductToCollection(id: number, productId: number) {
        return this.createQueryBuilder()
        .relation(Collection, "products")
        .of(id)
        .add(productId).then(() => {
            return true;
        });
    }

    removeProductFromCollection(id: number, productId: number) {
        return this.createQueryBuilder()
        .relation(Collection, "products")
        .of(id)
        .remove(productId).then(() => {
            return true;
        });
    }
}