import { EntityRepository, TreeRepository } from "typeorm";
import { Category } from "@entity/Category";
import { ProductType } from "@entity/ProductType";
import { Product } from "@entity/Product";

@EntityRepository(Category)
export class CategoryRepository extends TreeRepository<Category> {

    async insertSubCategory(parentId: number, name: string) {
        //Valdiation: Check parent category has no products assigned.
        const { numProducts } = await this.createQueryBuilder("category")
        .select("COUNT(*)", "numProducts")
        .innerJoin("category.products", "products")
        .where("category.id = :parentId", { parentId })
        .getRawOne();
        console.log(numProducts);

        if ( numProducts > 0) throw new Error("Cannot add a sub-category to a category with products assigned!");

        const newCategory = new Category();
        newCategory.parent = <any>{id: parentId};
        newCategory.name = name;
        await this.save(newCategory);
        return true;
    }

    async insertCategory(productTypeId: number, name: string) {
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

    async getLeafCategories(parentId: number) {
        const parent = new Category();
        parent.id = parentId;
        return this.createDescendantsQueryBuilder("category", "categoryClosure", parent)
        .where(qb => {
            const subQuery = qb.subQuery()
            .select("DISTINCT cat.parentid")
            .from(Category, "cat")
            .where("cat.parentId IS NOT NULL")
            .getQuery();
            return "category.id NOT IN " + subQuery;
        })
        .getMany();
    }

    private async validCategoryForProduct(id: number, productId: number) {
        const { parentId } = await this.createQueryBuilder("category")
        .select("DISTINCT rootCategory.id", "parentId")
        .from(Product, "product")
        .innerJoin("product.type","productType")
        .innerJoin("productType.rootCategory", "rootCategory")
        .where("product.id = :productId", { productId })
        .getRawOne();

        const parent = new Category();
        parent.id = parentId;
        const { isLeaf } = await this.createDescendantsQueryBuilder("category", "categoryClosure", parent)
        .select("COUNT(*)", "isLeaf")
        .where(qb => {
            const subQuery = qb.subQuery()
            .select("DISTINCT cat.parentid")
            .from(Category, "cat")
            .where("cat.parentId IS NOT NULL")
            .getQuery();
            return "category.id NOT IN " + subQuery;
        })
        .andWhere("category.id = " + id)
        .getRawOne();

        return Boolean(Number(isLeaf));

    }

    async addProduct(id: number, productId: number) {      
        if (!await this.validCategoryForProduct(id, productId)) throw new Error("Invalid category for product!");

        return this.createQueryBuilder()
        .relation(Category, "products")
        .of(id)
        .add(productId).then(() => {
            return true;
        });
    }
}