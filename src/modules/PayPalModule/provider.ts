import { Injectable } from "@graphql-modules/di";
import * as paypal from '@paypal/checkout-server-sdk';
import * as dotenv from "dotenv";
import { getCustomRepository } from "typeorm";
import { StockRepository } from "@repository/StockRepository";

import { buildRequestBody } from "@payPalUtils"

const result = dotenv.config()
if (result.error) throw result.error;

// Creating an environment
let clientId = process.env.PAYPAL_CLIENT_ID;
let clientSecret = process.env.PAYPAL_SECRET;

let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

@Injectable()
export class PayPalProvider {
    stockRepository = getCustomRepository(StockRepository);

    async createOrder(selectedStock) {
        const request = new paypal.orders.OrdersCreateRequest();
        request.headers["prefer"] = "return=representation";
        request.requestBody(await buildRequestBody(selectedStock));
        const response = await client.execute(request);

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

    async captureOrder(orderId) {
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});
        let response = await client.execute(request);
        console.log(`Response: ${JSON.stringify(response)}`);

        // If call returns body in response, you can get the deserialized version from the result attribute of the response.
        console.log(`CaptureId: ${response.result.id}`);
        if (response.statusCode === 201 && response.result.status === "COMPLETED") {

            return true;
        } else {
            return false;
        }
    }

    async getOrder(orderId) {
        const request = new paypal.orders.OrdersGetRequest(orderId);
        let response = await client.execute(request);
        console.log(response.result.purchase_units[0].items);
    }

    private async updateStock(orderId) {
        const request = new paypal.orders.OrdersGetRequest(orderId);
        let response = await client.execute(request);
        console.log(response.result.purchase_units[0].items);
    }

}