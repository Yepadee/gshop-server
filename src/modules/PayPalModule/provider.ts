import { Injectable } from "@graphql-modules/di";
import * as paypal from '@paypal/checkout-server-sdk';
import * as dotenv from "dotenv";
import { getRepository, In, getCustomRepository } from "typeorm";
import { Stock } from "@entity/Stock";
import { StockRepository } from "@repository/StockRepository";

const result = dotenv.config()
if (result.error) throw result.error;

// Creating an environment
let clientId = process.env.PAYPAL_CLIENT_ID;
let clientSecret = process.env.PAYPAL_SECRET;

let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

function buildRequestBody() {
    return {
        intent: "CAPTURE",
        application_context: {
            return_url: "https://www.example.com",
            cancel_url: "https://www.example.com",
            brand_name: "EXAMPLE INC",
            locale: "en-US",
            landing_page: "LOGIN",
            shipping_preference: "GET_FROM_FILE",
            user_action: "CONTINUE"
        },
        purchase_units: [
            {
                reference_id: "PUHF",
                description: "Sporting Goods",

                custom_id: "CUST-HighFashions",
                soft_descriptor: "HighFashions",
                amount: {
                    currency_code: "USD",
                    value: "180.00",
                    breakdown: {
                        item_total: {
                            currency_code: "USD",
                            value: "180.00"
                        },
                        shipping: {
                            currency_code: "USD",
                            value: "0.00"
                        },
                        handling: {
                            currency_code: "USD",
                            value: "0.00"
                        },
                        tax_total: {
                            currency_code: "USD",
                            value: "0.00"
                        },
                        shipping_discount: {
                            currency_code: "USD",
                            value: "0"
                        }
                    }
                },
                items: [
                    {
                        name: "T-Shirt",
                        description: "Green XL",
                        sku: "sku01",
                        unit_amount: {
                            currency_code: "USD",
                            value: "90.00"
                        },
                        tax: {
                            currency_code: "USD",
                            value: "0.00"
                        },
                        quantity: "1",
                        category: "PHYSICAL_GOODS"
                    },
                    {
                        name: "Shoes",
                        description: "Running, Size 10.5",
                        sku: "sku02",
                        unit_amount: {
                            currency_code: "USD",
                            value: "45.00"
                        },
                        tax: {
                            currency_code: "USD",
                            value: "0.00"
                        },
                        quantity: "2",
                        category: "PHYSICAL_GOODS"
                    }
                ]
            }
        ]
    };
}

@Injectable()
export class PayPalProvider {
    stockRepository = getCustomRepository(StockRepository);

    private async buildRequestBody(selectedStock) {

        const { items, totalValue } = await this.parseSelectedStock(selectedStock);

        const body = {
            intent: "CAPTURE",
            application_context: {
                return_url: "https://www.example.com",
                cancel_url: "https://www.example.com",
                brand_name: "EXAMPLE INC",
                locale: "en-US",
                landing_page: "LOGIN",
                shipping_preference: "GET_FROM_FILE",
                user_action: "CONTINUE"
            },
            purchase_units: [
                {
                    reference_id: "PUHF",
                    description: "Sporting Goods",
    
                    custom_id: "CUST-HighFashions",
                    soft_descriptor: "HighFashions",
                    amount: {
                        currency_code: "GBP",
                        value: totalValue.toString(),
                        breakdown: {
                            item_total: {
                                currency_code: "GBP",
                                value: totalValue.toString()
                            },
                            shipping: {
                                currency_code: "GBP",
                                value: "0.00"
                            },
                            handling: {
                                currency_code: "GBP",
                                value: "0.00"
                            },
                            tax_total: {
                                currency_code: "GBP",
                                value: "0.00"
                            },
                            shipping_discount: {
                                currency_code: "GBP",
                                value: "0"
                            }
                        }
                    },
                    items: items
                }
            ]
        };

        console.log(body);
        console.log(body.purchase_units[0].amount);
        console.log(body.purchase_units[0].items);
        return body;
    }

    private praseStockInfo(stockInfo, quantity: number) {
        const parsedItem = {
            name: stockInfo.name.toString(),
            description: stockInfo.properties.join(", "),
            sku: stockInfo.itemId.toString(),
            unit_amount: {
                currency_code: "GBP",
                value: stockInfo.price.toString()
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
    
    private async parseSelectedStock(selectedStock) {
        
        const ids = selectedStock.map(stock => {
            return stock.stockId
        });

        const itemMap = {};
        selectedStock.forEach(stock => {
            itemMap[stock.stockId] = stock.quantity;
        });

        const stockInfos = await this.stockRepository.getStockInfo(ids);
        const totalValue = stockInfos.reduce((acc, item) => acc + item.price * itemMap[item.itemId], 0);

        const parsed = stockInfos.map(stockInfo => 
            this.praseStockInfo(stockInfo, itemMap[stockInfo.itemId])
        );

        return {items: parsed, totalValue};
    }

    async createOrder(selectedStock) {
        const request = new paypal.orders.OrdersCreateRequest();
        request.headers["prefer"] = "return=representation";
        request.requestBody(await this.buildRequestBody(selectedStock));
        const response = await client.execute(request);

        let approveUrl;
        response.result.links.forEach( item => {
            if (item.rel === "approve")
            {
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