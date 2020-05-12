import { GraphQLModule } from "@graphql-modules/core";

import { ProductTypeModule } from "./ProductTypeModule";
import { ProductModule } from "./ProductModule";
import { StockModule } from "./StockModule";
import { TypePropertyNameModule } from "./TypePropertyNameModule";
import { TypePropertyValueModule } from "./TypePropertyValueModule";
import { ProductPropertyNameModule } from "./ProductPropertyNameModule";
import { ProductPropertyValueModule } from "./ProductPropertyValueModule";


export const GraphQLModules = new GraphQLModule({
    imports: [
        ProductTypeModule,
        ProductModule,
        StockModule,
        TypePropertyNameModule,
        TypePropertyValueModule,
        ProductPropertyNameModule,
        ProductPropertyValueModule
    ],
});