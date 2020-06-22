import { EntityRepository, Repository, getRepository, Like } from "typeorm";
import { Product } from "@entity/Product";
import { ProductType } from "@entity/ProductType";

import * as rimraf from "rimraf";


@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {

    productTypeRepository = getRepository(ProductType);

    async getProducts(take: number, skip: number, keyword: string, orderBy) {
        keyword = keyword || "";

        let query = this.createQueryBuilder("products")
        .limit(take)
        .offset(skip)
        .where("products.published = :published", { published: true })
        .andWhere("products.name like :keyword", { keyword: "%" + keyword + "%" })

        if (orderBy) {
            if (orderBy.sales) {
                query = query.innerJoin("products.stock", "stock")
                .groupBy("stock.productId")
                .orderBy({"SUM(stock.sales)" : orderBy.sales });
            }
            if ( orderBy.name ) {
                query = query.orderBy({"products.name"   : orderBy.name });
            }
            if ( orderBy.price ) {
                query = query.orderBy({"products.price"  : orderBy.price });
            }
            if ( orderBy.createdAt ) {
                query = query.orderBy({"products.createdAt"  : orderBy.createdAt });
            }
        }
        const result = await query.getMany();
        return result;
    }

    async insertProduct(product) {
        const data = await this.productTypeRepository.createQueryBuilder("productType")
        .select("propertyNames.id")
        .innerJoin("productType.propertyNames", "propertyNames")
        .where("productType.id = :typeId", {typeId: product.typeId})
        .getRawMany();
        const stripped = data.map(rowPacket => rowPacket.propertyNames_id.toString());

        if (!product.requiredPropertyIds.every(id => stripped.includes(id)))
        {
            throw new Error("A property selected cannot be chosen for this product type.");
        }
        const newProduct = new Product();
        newProduct.typeId = product.typeId;
        newProduct.name = product.name;
        newProduct.description = product.description;
        newProduct.price = product.price;
    
        newProduct.requiredProperties = product.requiredPropertyIds.map(id => <any>{id});
        console.log(newProduct);
        const res = await this.save(newProduct);
        console.log(res);
        return true;
    }

    async deleteProduct(id: number) {
        const { numStock } = await this.createQueryBuilder("product").select("COUNT(*)", "numStock")
        .innerJoin("product.stock", "stock")
        .where("product.id = :id", {id})
        .getRawOne();

        if (numStock > 0 ) throw new Error("Cannot remove a product that has stock!");

        await this.delete(id);
        rimraf.sync("public/product-images/" + id);
        
        return true;
    }

    async updateProduct(updatedProduct) {
        const values = {};

        if (updatedProduct.name) Object.assign(values, {name: updatedProduct.name})
        if (updatedProduct.description) Object.assign(values, {description: updatedProduct.description})
        if (updatedProduct.price) Object.assign(values, {price: updatedProduct.price})

        await this.createQueryBuilder()
        .update(Product)
        .set(values)
        .where("id = :productId", { productId: updatedProduct.id })
        .execute();
        
        return true;
    }

    async setPublished(id: number, published: boolean) {
        if (published) {
            const result = await this.createQueryBuilder("product")
            .select("COUNT(*) > 0", "hasStock")
            .innerJoin("product.stock", "stock")
            .where("product.id = :id", { id })
            .getRawOne();

            if (result.hasStock == 0) {
                throw new Error("Cannot publish product with no stock!");
            }
        }

        await this.createQueryBuilder()
        .update(Product)
        .set({published})
        .where("id = :id", { id })
        .execute();

        return true;
    }

    async addProductRequiredProperties(id: number, propertyNameIds: number[]) {
        await this.createQueryBuilder()
        .relation(Product, "requiredProperties")
        .of(id)
        .add(propertyNameIds)
        return true;
    }

    async removeProductRequiredProperties(id: number, propertyNameIds: number[]) {
        const { numStock } = await this.createQueryBuilder("product")
        .select("COUNT(DISTINCT stock.id)", "numStock")
        .innerJoin("product.stock", "stock")
        .innerJoin("stock.properties", "propertyValues")
        .innerJoin("propertyValues.propertyName", "propertyName")
        .where("propertyName.id IN (:...propertyNameIds)", { propertyNameIds })
        .getRawOne();
        
        if (numStock > 0) throw new Error("Cannot remove a require property form a product when there exists stock using this property!");

        await this.createQueryBuilder()
        .relation(Product, "requiredProperties")
        .of(id)
        .remove(propertyNameIds)
        return true;
    }
}