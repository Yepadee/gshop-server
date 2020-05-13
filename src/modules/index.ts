import { GraphQLModule } from "@graphql-modules/core";

import { ProductTypeModule } from "./ProductTypeModule";
import { ProductModule } from "./ProductModule";
import { StockModule } from "./StockModule";
import { PropertyNameModule } from "./PropertyNameModule";
import { PropertyValueModule } from "./PropertyValueModule";
import { AvailablePropertiesModule } from "./AvailablePropertiesModule";


export const GraphQLModules = new GraphQLModule({
    imports: [
        ProductTypeModule,
        ProductModule,
        StockModule,
        PropertyNameModule,
        PropertyValueModule,
        AvailablePropertiesModule
    ],
});