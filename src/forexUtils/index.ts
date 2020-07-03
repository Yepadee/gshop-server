import axios from "axios";
import { Cache } from "memory-cache";

// Hour - Secound - Microsecond
const CACHE_DURATION = 2 * 3600 * 1000;
const CONVERSION_CHARGE = 1.04;

export enum Currency {
    GBP = "GBP",
    USD = "USD",
    CAD = "CAD",
    AUD = "AUD",
    EUR = "EUR",
    NZD = "NZD",
    JPY = "JYP",
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

    private async getExchangeRate(currency: Currency) {
        const homeCurrency: string = <string> process.env.HOME_CURRENCY;
        let exchangeRate = this.cache.get(currency);
        if (!exchangeRate) {
            if (currency === Currency.EUR) {
                exchangeRate = await this.client.get(`/latest?symbols=${homeCurrency}`).then(({ data }) => {
                    return 1.0 / data.rates[homeCurrency];
                });
            } else {
                exchangeRate = await this.client.get(`/latest?symbols=${homeCurrency},${currency}`).then(({ data }) => {
                    return data.rates[currency] / data.rates[homeCurrency];
                });
            }
        }
        this.cache.put(currency, exchangeRate, CACHE_DURATION);
        return exchangeRate;
    }

    private roundUp(num: number, sf: number, minPrecision: number) {
        const numDigits = Math.ceil(Math.log10(num));
        const div = numDigits - sf;

        
        let result;

        if (div <= 0) {
            let precision = Math.min(minPrecision, Math.abs(div));
            precision = Math.pow(10, precision);
            result = Math.ceil(num * precision) / precision
        } else {
            sf = Math.pow(10, div)
            result = Math.ceil(num / sf) * sf;
        }

        return result;
    }

    private getCurrencyPrecision(currency: Currency) {
        let precision;
        if (currency in [Currency.JPY, Currency.INR]) precision = 1;
        else precision = 2;
        return precision;
    }

    public async convertPrice(currency: Currency, price: number) {
        if (currency != process.env.HOME_CURRENCY) {
            const exchangeRate = await this.getExchangeRate(currency);
            const minPrecision = this.getCurrencyPrecision(currency);
            price = this.roundUp(price * exchangeRate * CONVERSION_CHARGE, 3, minPrecision);
        }

        return price;
    }
}