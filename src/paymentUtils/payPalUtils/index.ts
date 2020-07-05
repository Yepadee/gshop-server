import { StockRepository } from "@repository/StockRepository";
import { template } from "./orderTampleate";
import { getCustomRepository, In } from "typeorm";
import * as paypal from '@paypal/checkout-server-sdk';
import * as dotenv from "dotenv";

import { PaymentMethod } from "@entity/Order";
import { OrderRepository } from "@repository/OrderRepository";
import { OrderItemRepository } from "@repository/OrderItemRepository";
import { Currency } from "@forexUtils";


const result = dotenv.config();
if (result.error) throw result.error;

export class PayPalRepository {
    stockRepository : StockRepository;
    orderRepository : OrderRepository;
    orderItemRepository : OrderItemRepository;

    client: any;
    
    constructor() {
        this.stockRepository = getCustomRepository(StockRepository);
        this.orderRepository = getCustomRepository(OrderRepository);
        this.orderItemRepository = getCustomRepository(OrderItemRepository);

        const clientId = process.env.PAYPAL_CLIENT_ID;
        const clientSecret = process.env.PAYPAL_SECRET;
        const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
        this.client = new paypal.core.PayPalHttpClient(environment);
    }

    private parseItemInfo(orderItem, quantity: number, currency: Currency) {
        if (!currency) currency = Currency.GBP;
        const parsedItem = {
            name: orderItem.name.toString(),
            description: orderItem.properties.join(", "),
            sku: orderItem.stockId.toString(),
            unit_amount: {
                currency_code: currency,
                value: orderItem.price.toString()
            },
            quantity: quantity.toString(),
            category: "PHYSICAL_GOODS"
        }
        
        return parsedItem;
    }

    private async buildRequestBody(returnUrl, cancelUrl, shippingAddress, orderItems, currency: Currency) {
        const { parsedItems, totalValue } = await this.stockRepository.parseOrderItems(orderItems, this.parseItemInfo, currency);
        
        const body = <any>template;

        if (shippingAddress) {
            body.application_context.shipping_preference = "SET_PROVIDED_ADDRESS";
            body.purchase_units[0].shipping = {
                name: {
                    full_name: shippingAddress.fullName,
                },
                address: {
                    address_line_1: shippingAddress.line1,
                    address_line_2: shippingAddress.line2,
                    admin_area_2: shippingAddress.adminArea2,
                    admin_area_1: shippingAddress.adminArea1,
                    postal_code: shippingAddress.postalCode,
                    country_code: shippingAddress.countryCode
                }
            };

        } else {
            body.application_context.shipping_preference = "GET_FROM_FILE";
        }

        body.purchase_units[0].amount.currency_code = currency,
        body.application_context.return_url = returnUrl;
        body.application_context.cancel_url = cancelUrl;
        body.purchase_units[0].items = parsedItems;
        body.purchase_units[0].amount.value = totalValue;
        body.purchase_units[0].amount.breakdown.item_total.value = totalValue;
        body.purchase_units[0].amount.breakdown.item_total.currency_code = currency;

        return body;
    }

    private async getItemsFromOrder(orderId: string) {
        const request = new paypal.orders.OrdersGetRequest(orderId);
        const response = await this.client.execute(request);
        return response.result.purchase_units[0].items;
    }

    public async createOrder(
        returnUrl: string,
        cancelUrl: string,
        shippingAddress,
        orderItems,
        currency: Currency
    ) {
        const request = new paypal.orders.OrdersCreateRequest();
        request.headers["prefer"] = "return=representation";
        return this.buildRequestBody(returnUrl, cancelUrl, shippingAddress, orderItems, currency).then(body => {
            request.requestBody(body);
            return this.client.execute(request).then(async ({ result }) => {
                await this.orderRepository.insertOrder(
                    result.id,
                    PaymentMethod.PAYPAL,
                    orderItems,
                    body.purchase_units[0].amount.value,
                    body.purchase_units[0].amount.breakdown.item_total.currency_code,
                );

                let approveUrl;
                result.links.forEach(item => {
                    if (item.rel === "approve") {
                        approveUrl = item.href;
                    }
                });
    
                const payPalOrder = {
                    orderId: result.id,
                    approveUrl
                };

                return payPalOrder;
            });
        });
    }

    public async captureOrder(orderId: string) {
        let request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});
        return this.client.execute(request).then(async response => {
            const transactionId = response.result.purchase_units[0].payments.captures[0].id;
            if (!(response.statusCode === 201 && response.result.status === "COMPLETED")) {
                throw new Error(`capture order request failed! statusCode: ${response.statusCode}, status: ${response.result.status}`);
            }

            return this.orderItemRepository.getOrderItemsByPaymentOrderRef(orderId).then((orderItems) => {
                orderItems.forEach(async (item: any) => {
                    await this.stockRepository.sellStock(item.stockId, item.quantity)
                });

                return this.orderRepository.confirmOrder(orderId, transactionId).then(() => {
                    return true;
                });
            });
        });
    }

    public async getOrderItems(orderId: string) {
        const items = await this.getItemsFromOrder(orderId);
        return items.map(item => {
            return {
                stockId: item.sku,
                quantity: item.quantity
            };
        });
    }

    public async getOrderItemsDetails(orderId: string) {
        const orderItems = await this.getOrderItems(orderId);
        const stockIds = orderItems.map( orderItem => orderItem.stockId);
        
        const itemQuantityMap = {};
        orderItems.forEach(item => {
            itemQuantityMap[item.stockId] = item.quantity
        });
        
        const stocks = await this.stockRepository.find({where: { id : In(stockIds) }});
        
        const orderItemsDetails = stocks.map(stock => {
            return {
                stock,
                quantity : itemQuantityMap[stock.id]
            }
        })

        return orderItemsDetails;
    }

}
