import { EntityRepository, TreeRepository, getManager } from "typeorm";
import { Category } from "@entity/Category";
import { ProductType } from "@entity/ProductType";

@EntityRepository(Category)
export class CategoryRepository extends TreeRepository<Category> {

    async insertSubCategory(parentCategoryId, name) {
        const newCategory = new Category();
        newCategory.parentId = parentCategoryId;
        newCategory.name = name;
        await this.save(newCategory);
        return true;
    }

    async insertCategory(productTypeId, name) {
        const { rootCategoryId } = await this.createQueryBuilder()
        .select("productType.rootCategoryId", "rootCategoryId")
        .from(ProductType, "productType")
        .where("productType.id =:productTypeId", { productTypeId })
        .getRawOne();
        await this.insertSubCategory(rootCategoryId, name);
        return true;
    }

    async getSubCategories(parentId: number) {
        const parent = new Category();
        parent.id = parentId;
        const result = await this.createDescendantsQueryBuilder("category", "categoryClosure", parent)
        .getMany();
        return result;
    }
}