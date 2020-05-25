import { Injectable } from "@graphql-modules/di";
import * as paypal from '@paypal/checkout-server-sdk';
import * as dotenv from "dotenv";
import { getRepository, In } from "typeorm";
import { Stock } from "@entity/Stock";

const result = dotenv.config()
if (result.error) throw result.error;

// Creating an environment
let clientId = process.env.PAYPAL_CLIENT_ID;
let clientSecret = process.env.PAYPAL_SECRET;

let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);



function buildRequestBody() {
    return {
        "intent": "CAPTURE",
        "application_context": {
            "return_url": "https://www.example.com",
            "cancel_url": "https://www.example.com",
            "brand_name": "EXAMPLE INC",
            "locale": "en-US",
            "landing_page": "LOGIN",
            "shipping_preference": "GET_FROM_FILE",
            "user_action": "CONTINUE"
        },
        "purchase_units": [
            {
                "reference_id": "PUHF",
                "description": "Sporting Goods",

                "custom_id": "CUST-HighFashions",
                "soft_descriptor": "HighFashions",
                "amount": {
                    "currency_code": "GBP",
                    "value": "220.00",
                    "breakdown": {
                        "item_total": {
                            "currency_code": "GBP",
                            "value": "180.00"
                        },
                        "shipping": {
                            "currency_code": "GBP",
                            "value": "20.00"
                        },
                        "handling": {
                            "currency_code": "GBP",
                            "value": "10.00"
                        },
                        "tax_total": {
                            "currency_code": "GBP",
                            "value": "20.00"
                        },
                        "shipping_discount": {
                            "currency_code": "GBP",
                            "value": "10"
                        }
                    }
                },
                "items": [
                    {
                        "name": "T-Shirt",
                        "description": "Green XL",
                        "sku": "sku01",
                        "unit_amount": {
                            "currency_code": "GBP",
                            "value": "90.00"
                        },
                        "tax": {
                            "currency_code": "GBP",
                            "value": "10.00"
                        },
                        "quantity": "1",
                        "category": "PHYSICAL_GOODS"
                    },
                    {
                        "name": "Shoes",
                        "description": "Running, Size 10.5",
                        "sku": "sku02",
                        "unit_amount": {
                            "currency_code": "GBP",
                            "value": "45.00"
                        },
                        "tax": {
                            "currency_code": "GBP",
                            "value": "5.00"
                        },
                        "quantity": "2",
                        "category": "PHYSICAL_GOODS"
                    }
                ]
            }
        ]
    };
}

@Injectable()
export class PayPalProvider {
    stockRepository = getRepository(Stock);

    private async parseItems(items) {
        const ids = items.map(item => {
            return item.stockId
        });

        const stock = await this.stockRepository.find({
            relations: ["product"],
            where: { id : In(ids) }
        });

        console.log(stock);

        return ids;
    }

    async createOrder(items) {
        const request = new paypal.orders.OrdersCreateRequest();
        request.headers["prefer"] = "return=representation";
        request.requestBody(buildRequestBody());
        const response = await client.execute(request);

        let approveUrl;
        response.result.links.forEach( item => {
            if (item.rel === "approve")
            {
                approveUrl = item.href;
            }
        });
        const parsedItems = await this.parseItems(items);
        console.log(parsedItems);
        const payPalOrder = {
            orderId: response.result.id,
            approveUrl
        };

        return payPalOrder;
    }

    async captureOrder(orderId) {
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});
        // Call API with your client and get a response for your call
        let response = await client.execute(request);
        console.log(`Response: ${JSON.stringify(response)}`);

        // If call returns body in response, you can get the deserialized version from the result attribute of the response.
        console.log(`CaptureId: ${response.result.id}`);
        if (response.statusCode === 201 && response.result.status === "COMPLETED")
        {
            return true;
        } else {
            return false;
        }  
    }


}