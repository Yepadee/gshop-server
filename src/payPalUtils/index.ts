import { StockRepository } from "@repository/StockRepository";
import { template } from "./orderTampleate";
import { getCustomRepository } from "typeorm";

export async function buildRequestBody(orderItems) {

    const { parsedItems, totalValue } = await parseOrderItems(orderItems);

    const body = <any>template;
    body.purchase_units[0].items = parsedItems;
    body.purchase_units[0].amount.value = totalValue;
    body.purchase_units[0].amount.breakdown.item_total.value = totalValue;

    return body;
}

function parseItemInfo(orderItem, quantity: number) {
    const parsedItem = {
        name: orderItem.name.toString(),
        description: orderItem.properties.join(", "),
        sku: orderItem.stockId.toString(),
        unit_amount: {
            currency_code: "GBP",
            value: orderItem.price.toString()
        },
        tax: {
            currency_code: "GBP",
            value: "0.00"
        },
        quantity: quantity.toString(),
        category: "PHYSICAL_GOODS"
    }
    
    return parsedItem;
}

async function parseOrderItems(orderItems) {
    const stockRepository = getCustomRepository(StockRepository);
    const ids = orderItems.map(item => {
        return item.stockId
    });

    const orderItemsInfo = await stockRepository.getOrderItemsDetails(ids);

    const itemMap = {};
    orderItems.forEach(orderItem => {
        itemMap[orderItem.stockId] = orderItem.quantity;
    });
    const totalValue = orderItemsInfo.reduce((acc, item) => acc + item.price * itemMap[item.stockId], 0);
    const parsedItems = orderItemsInfo.map(orderItemInfo =>
        parseItemInfo(orderItemInfo, itemMap[orderItemInfo.stockId])
    );

    return { parsedItems, totalValue };
}