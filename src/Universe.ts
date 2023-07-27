import axios, { AxiosInstance } from 'axios';
import { DataStore, OrderedDataStore, DataStorePages } from './datastore';

const BASE_URL = 'https://apis.roblox.com';

export class Universe {
    universeId: number;
    apiKey: string;
    client: AxiosInstance;

    constructor(universeId: number, apiKey: string) {
        this.universeId = universeId;
        this.apiKey = apiKey;
        this.client = axios.create({
            baseURL: BASE_URL,
            timeout: 1000,
            headers: {
                'x-api-key': apiKey,
            },
        });
    }

    getDataStore(name: string, scope?: string): DataStore {
        return new DataStore(this, name, scope);
    }

    getOrderedDataStore(name: string, scope?: string): OrderedDataStore {
        return new OrderedDataStore(this, name, scope);
    }

    async listDataStoresAsync(pageSize: number = 250, prefix?: string): Promise<DataStorePages> {
        const pages = new DataStorePages(this, pageSize, prefix);
        await pages.advanceToNextPageAsync();
        return pages;
    }

    async publishMessageAsync(topic: string, message: string): Promise<void> {
        return this.client
            .post(`/messaging-service/v1/universes/${this.universeId}/topics/${topic}`, {
                message,
            })
            .then(() => {
                return;
            })
            .catch((error) => {
                throw error;
            });
    }
}
