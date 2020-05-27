export const template = {
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
            description: "Clothing",

            custom_id: "CUST-GSHOP",
            soft_descriptor: "GSHOP",
            amount: {
                currency_code: "GBP",
                breakdown: {
                    item_total: {
                        currency_code: "GBP",
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
        }
    ]
};