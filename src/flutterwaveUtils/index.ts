import { StockRepository } from "@repository/StockRepository";
import { getCustomRepository } from "typeorm";
import * as dotenv from "dotenv";

import { OrderRepository } from "@repository/OrderRepository";

const Rave = require("flutterwave-node-v3");


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

        const publicKey = process.env.FLUTTERWAVE_PUBLIC_KEY;
        const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
        const productionFlag = !(process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test");
        
        console.log(productionFlag);

        this.client = new Rave(publicKey, secretKey, productionFlag);
    }

    public async createOrder() {
        try {
            const payload = {
                "tx_ref": "MC-1585230ew9v5050e8",
                "amount": "100",
                "account_bank": "00000", //This is the Bank numeric code e.g 058
                "account_number": "0000000000",
                "currency": "GBP",
                "email": "olufemi@flw.com",
                "phone_number": "0902620185",
                "fullname": "Olufemi Obafunmiso"
            }
    
            const response = await this.client.Charge.uk(payload)
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }
}