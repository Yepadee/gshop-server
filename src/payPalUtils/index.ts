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

        let clientId = process.env.PAYPAL_CLIENT_ID;
        let clientSecret = process.env.PAYPAL_SECRET;
        let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
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

    private buildItemQuantityMap(orderItems) {
        const itemQuantityMap = {};
        orderItems.forEach(orderItem => {
            itemQuantityMap[orderItem.stockId] = orderItem.quantity;
        });
        return itemQuantityMap
    }

    private async parseOrderItems(orderItems) {
        const ids = orderItems.map(item => {
            return item.stockId
        });
    
        const orderItemsInfo = await this.stockRepository.getOrderItemsDetails(ids);
    
        const itemQuantityMap = this.buildItemQuantityMap(orderItems);
        const totalValue = orderItemsInfo.reduce((acc, item) => acc + item.price * itemQuantityMap[item.stockId], 0);
        const parsedItems = orderItemsInfo.map(orderItemInfo =>
            this.parseItemInfo(orderItemInfo, itemQuantityMap[orderItemInfo.stockId])
        );
    
        return { parsedItems, totalValue };
    }

    private async buildRequestBody(orderItems, returnUrl, cancelUrl) {
        const { parsedItems, totalValue } = await this.parseOrderItems(orderItems);
        
        const body = <any>template;
        body.application_context.return_url = returnUrl;
        body.application_context.cancel_url = cancelUrl;
        body.purchase_units[0].items = parsedItems;
        body.purchase_units[0].amount.value = totalValue;
        body.purchase_units[0].amount.breakdown.item_total.value = totalValue;
    
        return body;
    }

    private async getItemsFromOrder(orderId: string) {
        const request = new paypal.orders.OrdersGetRequest(orderId);
        const response = await this.client.execute(request);
        return response.result.purchase_units[0].items;
    }


    public async createOrder(selectedStock, returnUrl: string, cancelUrl: string) {
        const request = new paypal.orders.OrdersCreateRequest();
        request.headers["prefer"] = "return=representation";
        request.requestBody(await this.buildRequestBody(selectedStock, returnUrl, cancelUrl));
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

        // Update stock quantity
        items.forEach(item => {
            this.stockRepository.decrementStockQuantity(item.sku, item.quantity)
        });


        const orderItems = items.map(item => {
            return {
                __stock__: <any>{id: item.sku},
                quantity: item.quantity
            }
        });

        // Save order details
        const order = new Order();
        order.orderId = orderId;
        order.paymentMethod = PaymentMethod.PAYPAL;
        order.items = orderItems;

        await this.orderRepository.save(order);
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

    public async checkOrderItemsInStock(orderItems) {
        const ids = orderItems.map(orderItem => orderItem.stockId);
        const itemQuantityMap = this.buildItemQuantityMap(orderItems);
        const stocks = await this.stockRepository.find({ where: {id: In(ids)} });
        stocks.forEach(stock => {
            const quantity = itemQuantityMap[stock.id];
            if(quantity > stock.quantity) throw new Error("One or more selected items are out of stock!");
        });
    }

}
