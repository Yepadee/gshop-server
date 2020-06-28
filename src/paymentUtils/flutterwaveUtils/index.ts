import { StockRepository } from "@repository/StockRepository";
import { getCustomRepository } from "typeorm";
import * as dotenv from "dotenv";

import { OrderRepository } from "@repository/OrderRepository";

import axios from "axios";
import { uuid } from "uuidv4";


const result = dotenv.config();
if (result.error) throw result.error;

export class FlutterwaveRepository {
    stockRepository : StockRepository;
    orderRepository : OrderRepository;

    client: any;

    constructor()
    {
        this.stockRepository = getCustomRepository(StockRepository);
        this.orderRepository = getCustomRepository(OrderRepository);

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

    public async createOrder(returnUrl, orderItems, customerDetails, address) {
        const { parsedItems, totalValue } = await this.stockRepository.parseOrderItems(orderItems, this.parseItemInfo);
        const payload = {
            "tx_ref": uuid(),
            "amount": totalValue,
            "currency": "GBP",
            "redirect_url": returnUrl,
            "payment_options": "card",
            "customer": {
              "email": "yepadee69@gmail.com",
              "phonenumber": "07543585504",
              "name": "James Hawkins"
            },
            "meta": {
                ...address,
                ...parsedItems
            },
            "customizations": {
               "title": "gShop Payments",
               "description": "Middleout isn't free. Pay the price",
               "logo": "https://assets.piedpiper.com/logo.png"
            }
        }
    
        return this.client.post("/payments", payload).then(({ data }) => {
            console.log(data);
            return {
                orderId: 1,
                approveUrl: data.data.link
            };
        }).catch(error => {
            throw new Error(error);
        });
        
    }
}