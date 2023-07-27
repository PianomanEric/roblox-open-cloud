import { OrderedDataStore } from "./OrderedDataStore";
import { OpenCloudError } from '../OpenCloudError';

export class OrderedDataStoreEntryPages {

    isFinished: boolean = false;
    cursor: string | null = null;
    datastore: OrderedDataStore;
    limit: number;
    ascending: boolean;
    filter?: string;
    currentPage: [] | null = null;
    path: string;

    constructor(datastore: OrderedDataStore, limit: number = 250, ascending: boolean = false, filter?: string) {
        this.datastore = datastore;
        this.limit = limit;
        this.filter = filter;
        this.ascending = ascending;
        this.path = `/ordered-data-stores/v1/universes/${datastore.universe.universeId}/orderedDataStores/${datastore.name}/scopes/${datastore.scope || 'global'}/entries`;
    }

    async advanceToNextPageAsync(): Promise<void> {
        if (this.isFinished) {
            this.currentPage = [];
            return;
        }
        return this.datastore.universe.client.get(this.path, {
            params: {
                order_by: this.ascending ? 'asc' : 'desc',
                page_token: this.cursor,
                max_page_size: this.limit
                // filter here
            }
        }).then((response) => {
            this.currentPage = response.data.entries.map(({id, value}: {id: string, value: any}) => {
                return {
                    key: id,
                    value: value
                }
            });
            this.cursor = response.data.nextPageToken;
            if (!this.cursor) {
                this.isFinished = true;
            }
        }).catch((error) => {
            throw OpenCloudError.fromResponse(error?.response);
        });
    }
    
}