import { StockRepository } from "@repository/StockRepository";
import { getCustomRepository } from "typeorm";
import * as dotenv from "dotenv";

import { OrderRepository } from "@repository/OrderRepository";

import axios from "axios";
import { uuid } from "uuidv4";
import { OrderItemRepository } from "@repository/OrderItemRepository";
import { PaymentMethod } from "@entity/Order";


const result = dotenv.config();
if (result.error) throw result.error;

export class FlutterwaveRepository {
    stockRepository : StockRepository;
    orderRepository : OrderRepository;
    orderItemRepository : OrderItemRepository;

    client: any;

    constructor() {
        this.stockRepository = getCustomRepository(StockRepository);
        this.orderRepository = getCustomRepository(OrderRepository);
        this.orderItemRepository = getCustomRepository(OrderItemRepository);

        const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
        
        this.client = axios.create({
            baseURL: 'https://api.flutterwave.com/v3',
            timeout: 3000,
            headers: {'Authorization': `Bearer ${secretKey}`}
        });

    }

    private parseItemInfo(orderItem, quantity: number) {
        const parsedItem = {
            name: orderItem.name.toString(),
            description: orderItem.properties.join(", "),
            sku: orderItem.stockId.toString(),
            unit_amount: orderItem.price.toString(),
            quantity: quantity.toString(),
            category: "PHYSICAL_GOODS"
        }
        
        return parsedItem;
    }
    
    public async createOrder(returnUrl: string, orderItems, customerDetails) {
        return this.stockRepository.parseOrderItems(orderItems, this.parseItemInfo).then(({ parsedItems, totalValue }) => {
            const transactionRef = uuid();
            
            const payload = {
                "tx_ref": transactionRef,
                "amount": totalValue,
                "currency": "GBP",
                "redirect_url": returnUrl,
                "payment_options": "card",
                "customer": {
                  "email": customerDetails.email,
                  "phone_number": customerDetails.phonenumber,
                  "name": customerDetails.name
                },
                "meta": {
                    ...customerDetails.address,
                    items: JSON.stringify(parsedItems)
                },
                "customizations": {
                   "title": "gShop Payments",
                   "description": "Middleout isn't free. Pay the price",
                   "logo": "https://assets.piedpiper.com/logo.png"
                }
            }
        
            return this.client.post("/payments", payload).then((response) => {
                return this.orderRepository.insertOrder(
                    transactionRef,
                    PaymentMethod.FLUTTERWAVE,
                    orderItems,
                    totalValue,
                    "GBP"
                ).then(() => {
                    return {
                        transactionRef,
                        approveUrl: response.data.data.link
                    };
                });
            })
        });
    }

    public async verifyOrder(transactionRef: string, transactionId: string) {
        return this.client.get(`/transactions/${transactionId}/verify`).then(result => {
            if (result.data.status != "success") throw new Error("Failed to fetch transaction.");
            return this.orderItemRepository.getOrderItemsByPaymentOrderRef(transactionRef).then((orderItems) => {
                orderItems.forEach(async (item: any) => {
                    await this.stockRepository.sellStock(item.__stockId__, item.quantity);
                });

                return this.orderRepository.confirmOrder(transactionRef, transactionId).then(() => {
                    return true;
                });
            });
        });
    }
}