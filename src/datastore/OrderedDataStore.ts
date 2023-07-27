import { Universe } from '../Universe';
import { OpenCloudError } from '../OpenCloudError';
import { OrderedDataStoreEntryPages } from './OrderedDataStoreEntryPages';

export class OrderedDataStore {
    universe: Universe;
    name: string;
    scope?: string;
    path: string;

    constructor(universe: Universe, name: string, scope: string = 'global') {
        this.universe = universe;
        this.name = name;
        this.scope = scope;
        this.path = `/ordered-data-stores/v1/universes/${universe.universeId}/orderedDataStores/${name}/scopes/${scope}/entries`;
    }

    async setAsync(key: string, value: number): Promise<void> {
        return this.universe.client
            .post(
                this.path,
                {
                    value,
                },
                {
                    params: {
                        id: key,
                    },
                },
            )
            .then(() => {
                return;
            })
            .catch((error) => {
                throw OpenCloudError.fromResponse(error?.response);
            });
    }

    async getAsync(key: string): Promise<number> {
        return this.universe.client
            .get(this.path + `/${key}`)
            .then((response) => {
                return response.data.value;
            })
            .catch((error) => {
                throw OpenCloudError.fromResponse(error?.response);
            });
    }

    async removeAsync(key: string): Promise<void> {
        return this.universe.client
            .delete(this.path + `/${key}`)
            .then(() => {
                return;
            })
            .catch((error) => {
                throw OpenCloudError.fromResponse(error?.response);
            });
    }

    async updateAsync(key: string, value: number, createIfNotExists: boolean = false): Promise<void> {
        return this.universe.client
            .patch(
                this.path + `/${key}`,
                {
                    value,
                },
                {
                    params: {
                        allow_missing: createIfNotExists,
                    },
                },
            )
            .then(() => {
                return;
            })
            .catch((error) => {
                throw OpenCloudError.fromResponse(error?.response);
            });
    }

    async incrementAsync(key: string, incrementBy: number = 1): Promise<number> {
        return this.universe.client
            .post(this.path + `/${key}:increment`, {
                amount: incrementBy,
            })
            .then((response) => {
                return response.data.value;
            })
            .catch((error) => {
                throw OpenCloudError.fromResponse(error?.response);
            });
    }

    async listEntriesAsync(pageSize: number = 250, ascending: boolean = true): Promise<OrderedDataStoreEntryPages> {
        const pages = new OrderedDataStoreEntryPages(this, pageSize, ascending);
        await pages.advanceToNextPageAsync();
        return pages;
    }
}
