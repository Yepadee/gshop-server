import { Injectable } from "@graphql-modules/di";

import { getCustomRepository } from "typeorm";
import { CollectionRepository } from "@repository/CollectionRepository";


@Injectable()
export class CollectionProvider {
    repository = getCustomRepository(CollectionRepository);

    getCollections(args) {
        return this.repository.getCollections(args);
    }

    getCollection(id: number) {
        return this.repository.getCollectionById(id);
    }

    createCollection(name: string) {
        return this.repository.insertCollection(name);
    }

    updateCollection(args) {
        return this.repository.updateCollection(args);
    }

    deleteCollection(id: number) {
        return this.repository.deleteCollection(id);
    }

    addProductToCollection(id: number, productId: number) {
        return this.repository.addProductToCollection(id, productId);
    }

    removeProductFromCollection(id: number, productId: number) {
        return this.repository.removeProductFromCollection(id, productId);
    }
}