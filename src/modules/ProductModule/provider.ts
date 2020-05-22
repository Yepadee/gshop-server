import { Injectable } from "@graphql-modules/di";

import { getRepository } from "typeorm";
import { Product } from '@entity/Product';
import { ProductType } from "@entity/ProductType";

@Injectable()
export class ProductProvider {
    repository = getRepository(Product);

    productTypeRepository = getRepository(ProductType);

    getProducts(args) {
        return this.repository.find({ where: args });
    }
    getProductById(id: number) {
        return this.repository.findOne(id);
    }

    async addProduct(product) {
        //TODO: Check requiredPropertyIds are in type propertyNameIds.
        const data = await this.productTypeRepository.createQueryBuilder("productType")
        .select("propertyNames.id")
        .innerJoin("productType.propertyNames", "propertyNames")
        .where("productType.id = :typeId", {typeId: product.typeId})
        .getRawMany();
        const stripped = data.map(rowPacket => rowPacket.propertyNames_id.toString());

        if (product.requiredPropertyIds.every(id => stripped.includes(id)))
        {
            const newProduct = new Product();
            newProduct.typeId = product.typeId;
            newProduct.name = product.name;
            newProduct.description = product.description;
            newProduct.price = product.price;
            newProduct.catagory = product.catagory;
    
            newProduct.requiredProperties = product.requiredPropertyIds.map(id => <any>{id});
            
            await this.repository.save(newProduct);
            return true;
        }
        else
        {
            throw new Error("A property selected cannot be chosen for this product type.");
        }

    }

    async updateProduct(updatedProduct) {
        const values = {};

        if (updatedProduct.name) Object.assign(values, {name: updatedProduct.name})
        if (updatedProduct.catagory) Object.assign(values, {catagory: updatedProduct.catagory})
        if (updatedProduct.description) Object.assign(values, {description: updatedProduct.description})
        if (updatedProduct.price) Object.assign(values, {price: updatedProduct.price})

        await this.repository.createQueryBuilder()
        .update(Product)
        .set(values)
        .where("id = :productId", { productId: updatedProduct.id })
        .execute();
        
        return true;
    }

    async removeProduct(id: number) {
        await this.repository.delete(id);
        return true;
    }
}