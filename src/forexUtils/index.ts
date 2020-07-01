import axios from "axios";
import { Cache } from "memory-cache";

const CACHE_DURATION = 3600 * 1000;

export enum Currency {
    GBP = "GBP",
    USD = "USD",
    CAD = "CAD",
    AUD = "AUD",
    EUR = "EUR",
    JPY = "JYP",
    NZD = "NZD",
    INR = "INR"
  }

export class CurrencyConverter {
    client: any;
    cache: Cache;

    constructor() {
        this.cache = new Cache();

        this.client = axios.create({
            baseURL: `https://api.exchangeratesapi.io`,
            timeout: 3000
        });

    }

    private getExchangeRate(currency: Currency) {
        let exchangeRate = this.cache.get(currency);
        if (exchangeRate) {
            return exchangeRate;
        } else {
            return this.client.get(`/latest?symbols=${process.env.HOME_CURRENCY},${currency}`).then(({ data }) => {
                exchangeRate = data.rates[currency];
                this.cache.put(currency, exchangeRate, CACHE_DURATION);
                return exchangeRate;
            });
        }
    }

    public convertPrice(currency: Currency, price: number) {
        const exchangeRate = this.getExchangeRate(currency);
        return Math.ceil(price * exchangeRate);
    }
}