import { StockRepository } from "@repository/StockRepository";
import { template } from "./orderTampleate";
import { getCustomRepository, In } from "typeorm";
import * as paypal from '@paypal/checkout-server-sdk';
import * as dotenv from "dotenv";

import { Order, PaymentMethod } from "@entity/Order";
import { OrderRepository } from "@repository/OrderRepository";


const result = dotenv.config();
if (result.error) throw result.error;

export class PayPalRepository {
    stockRepository : StockRepository;
    orderRepository : OrderRepository;

    client: any;
    
    constructor()
    {
        this.stockRepository = getCustomRepository(StockRepository);
        this.orderRepository = getCustomRepository(OrderRepository);

        const clientId = process.env.PAYPAL_CLIENT_ID;
        const clientSecret = process.env.PAYPAL_SECRET;
        const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
        this.client = new paypal.core.PayPalHttpClient(environment);
    }

    private parseItemInfo(orderItem, quantity: number) {
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

    private async buildRequestBody(returnUrl, cancelUrl, shippingAddress, orderItems) {
        const { parsedItems, totalValue } = await this.stockRepository.parseOrderItems(orderItems, this.parseItemInfo);

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

        body.application_context.return_url = returnUrl;
        body.application_context.cancel_url = cancelUrl;
        body.purchase_units[0].items = parsedItems;
        body.purchase_units[0].amount.value = totalValue;
        body.purchase_units[0].amount.breakdown.item_total.value = totalValue;
        body.purchase_units[0].amount.breakdown.item_total.currency_code = "GBP";

        return body;
    }

    private async getItemsFromOrder(orderId: string) {
        const request = new paypal.orders.OrdersGetRequest(orderId);
        const response = await this.client.execute(request);
        return response.result.purchase_units[0].items;
    }

    public async createOrder(returnUrl: string, cancelUrl: string, shippingAddress, selectedStock) {
        const request = new paypal.orders.OrdersCreateRequest();
        request.headers["prefer"] = "return=representation";
        request.requestBody(await this.buildRequestBody(returnUrl, cancelUrl, shippingAddress, selectedStock));
        const response = await this.client.execute(request);

        let approveUrl;
        response.result.links.forEach(item => {
            if (item.rel === "approve") {
                approveUrl = item.href;
            }
        });

        const payPalOrder = {
            orderId: response.result.id,
            approveUrl
        };

        return payPalOrder;
    }

    public async captureOrder(orderId: string) {
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});
        let response = await this.client.execute(request);
        if (!(response.statusCode === 201 && response.result.status === "COMPLETED")) {
            throw new Error(`capture order request failed! statusCode: ${response.statusCode}, status: ${response.result.status}`);
        }
    }

    public async finaliseOrder(orderId: string) {
        const request = new paypal.orders.OrdersGetRequest(orderId);
        const response = await this.client.execute(request);
        const items = response.result.purchase_units[0].items;

        const amount = response.result.purchase_units[0].amount;

        // Update stock quantity
        items.forEach(item => {
            this.stockRepository.sellStock(item.sku, item.quantity)
        });

        const orderItems = items.map(item => {
            return {
                __stock__: <any>{id: item.sku},
                quantity: item.quantity
            }
        });

        const shipping = response.result.purchase_units[0].shipping;
        const address = shipping.address;
        const shippingAddress = {
            name: shipping.name.full_name,
            line1: address.address_line_1,
            line2: address.address_line_2,
            adminArea2: address.admin_area_2,
            adminArea1: address.admin_area_1,
            postalCode: address.postal_code,
            countryCode: address.country_code
        }

        await this.orderRepository.insertOrder(
            orderId,
            shippingAddress,
            PaymentMethod.PAYPAL,
            orderItems,
            amount.value,
            amount.currency_code
        );

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
