import { GraphQLModule } from "@graphql-modules/core";

import { ProductTypeModule } from "./ProductTypeModule";
import { ProductModule } from "./ProductModule";
import { StockModule } from "./StockModule";
import { PropertyNameModule } from "./PropertyNameModule";
import { PropertyValueModule } from "./PropertyValueModule";
import { AvailablePropertyModule } from "./AvailablePropertyModule";
import { UserModule } from "./UserModule";
import { AuthModule } from "./AuthModule";
import { ProductImageModule } from "./ProductImageModule";


export const GraphQLModules = new GraphQLModule({
    imports: [
        ProductTypeModule,
        ProductModule,
        StockModule,
        PropertyNameModule,
        PropertyValueModule,
        AvailablePropertyModule,
        UserModule,
        AuthModule,
        ProductImageModule
    ]
});