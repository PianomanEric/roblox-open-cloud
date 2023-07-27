import { DataStore } from "./DataStore";
import { OpenCloudError } from "../OpenCloudError";

export class DataStoreKeyPages {

    isFinished: boolean = false;
    cursor: string | null = null;
    datastore: DataStore;
    limit: number;
    allScopes: boolean;
    prefix?: string;
    currentPage: [] | null = null;
    path: string;

    constructor(datastore: DataStore, limit: number = 250, allScopes: boolean = false, prefix?: string) {
        this.datastore = datastore;
        this.limit = limit;
        this.prefix = prefix;
        this.allScopes = allScopes;
        this.path = `/datastores/v1/universes/${datastore.universe.universeId}/standard-datastores`;
    }

    async advanceToNextPageAsync(): Promise<void> {
        if (this.isFinished) {
            this.currentPage = [];
            return;
        }
        return this.datastore.universe.client.get(this.path + '/datastore/entries', {
            params: {
                datastoreName: this.datastore.name,
                scope: (!this.allScopes) ? this.datastore.scope : undefined,
                allScopes: this.allScopes,
                cursor: this.cursor,
                limit: this.limit,
                prefix: this.prefix,
            }
        }).then((response) => {
            this.currentPage = response.data.keys;
            this.cursor = response.data.nextPageCursor;
            if (!this.cursor) {
                this.isFinished = true;
            }
        }).catch((error) => {
            throw OpenCloudError.fromResponse(error?.response);
        });
    }
    
}