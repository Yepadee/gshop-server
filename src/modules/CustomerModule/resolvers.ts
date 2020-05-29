import { CustomerProvider } from "./provider";

export default {
    Query: {
        customers: (_, args, { injector }) => injector.get(CustomerProvider).getCustomers(args),
        customer: (_, { id }, { injector }) => injector.get(CustomerProvider).getCustomerById(id)
    },
    
    Order: {
        customer: order => order.customer
    }

};