export const template = {
    intent: "CAPTURE",
    application_context: {
        brand_name: "GSHOP",
        locale: "en-US",
        landing_page: "LOGIN",
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
                    }
                }
            },
        }
    ]
};