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

    public async createOrder() {
        const payload = {
            "tx_ref": uuid(),
            "amount": "100",
            "currency": "GBP",
            "redirect_url": "https://webhook.site/9d0b00ba-9a69-44fa-a43d-a82c33c36fdc",
            "payment_options": "card",
            "customer": {
             "email": "yepadee69@gmail.com",
              "phonenumber": "07543585504",
              "name": "James Hawkins"
            },
            "meta": {
                "addressline1": "10 Parnell Gardens"
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