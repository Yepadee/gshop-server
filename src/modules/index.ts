import { GraphQLModule } from "@graphql-modules/core";

import { ProductTypeModule } from "./ProductTypeModule";
import { ProductModule } from "./ProductModule";
import { StockModule } from "./StockModule";
import { PropertyNameModule } from "./PropertyNameModule";
import { PropertyValueModule } from "./PropertyValueModule";
import { UserModule } from "./UserModule";
import { AuthModule } from "./AuthModule";
import { ProductImageModule } from "./ProductImageModule";
import { PayPalModule } from "./PayPalModule";
import { OrderModule } from "./OrderModule";
import { OrderItemModule } from "./OrderItemModule";
import { CategoryModule } from "./CategoryModule";
import { FlutterwaveModule } from "./FlutterwaveModule";
import { CurrencyModule } from "./CurrencyModule";
import { CollectionModule } from "./CollectionModule";


export const GraphQLModules = new GraphQLModule({
    imports: [
        ProductTypeModule,
        ProductModule,
        StockModule,
        PropertyNameModule,
        PropertyValueModule,
        UserModule,
        AuthModule,
        ProductImageModule,
        PayPalModule,
        FlutterwaveModule,
        OrderModule,
        OrderItemModule,
        CurrencyModule,
        CategoryModule,
        CollectionModule
    ]
});