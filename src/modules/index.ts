import { GraphQLModule } from "@graphql-modules/core";

import { ProductTypeModule } from "./ProductTypeModule";
import { ProductModule } from "./ProductModule";


export const GraphQLModules = new GraphQLModule({
    imports: [
        ProductTypeModule,
        ProductModule
    ],
});