import "graphql-import-node";
import { GraphQLModule } from "@graphql-modules/core";
import { Currency } from "@forexUtils";


export const CurrencyModule = new GraphQLModule({
  context: ({ req }, _, __) => {
    let currency = req.headers.currency;
    if (!currency) currency = process.env.HOME_CURRENCY;
    if (!(currency in Currency)) throw new Error("Unsupported currency requested!");
    return { currency }
  }
});