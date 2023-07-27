import { Universe } from '../Universe';
import { OpenCloudError } from '../OpenCloudError';
import { DataStoreKeyInfo } from './DataStoreKeyInfo';
import { DataStoreSetOptions } from './DataStoreSetOptions';
import { DataStoreKeyMetadata } from './DataStoreKeyMetadata';
import { DataStoreKeyPages } from './DataStoreKeyPages';
import { generateMD5, validateMD5 } from '../util/md5';

export class DataStore {

    universe: Universe;
    name: string;
    scope?: string;
    path: string;

    constructor(universe: Universe, name: string, scope: string = 'global') {
        this.universe = universe;
        this.name = name;
        this.scope = scope;
        this.path = `/datastores/v1/universes/${universe.universeId}/standard-datastores`;
    }

    async getAsync(key: string): Promise<[any, DataStoreKeyInfo]> {
        return this.universe.client.get(this.path + '/datastore/entries/entry', {
            params: {
                datastoreName: this.name,
                entryKey: key,
                scope: this.scope,
            }
        }).then((response): [any, DataStoreKeyInfo] => {;
            this.#errorOnInvalidMD5(response?.headers['content-md5'], response.data);
            const createdTime: string = response.headers['roblox-entry-created-time'];
            const updatedTime: string = response.headers['roblox-entry-version-created-time'];
            const version: string = response.headers['roblox-entry-version'];
            const attributes: string = response.headers['roblox-entry-attributes'];
            const userIds: string = response.headers['roblox-entry-userids'];
            const keyInfo: DataStoreKeyInfo = new DataStoreKeyInfo(createdTime, updatedTime, version, attributes, userIds);
            return [response.data, keyInfo];
        }).catch((error) => {
            throw OpenCloudError.fromResponse(error?.response);
        });
    }
    
    async setAsync(key: string, value: any, setOptions: DataStoreSetOptions = new DataStoreSetOptions(), metadata: DataStoreKeyMetadata = new DataStoreKeyMetadata()): Promise<DataStoreKeyInfo> {
        return this.universe.client.post(this.path + '/datastore/entries/entry', JSON.stringify(value), {
            params: {
                datastoreName: this.name,
                entryKey: key,
                scope: this.scope,
                exclusiveCreate: setOptions.exclusiveCreate,
                matchVersion: setOptions.matchVersion,
            },
            headers: {
                'content-md5': generateMD5(value),
                'content-type': 'application/json',
                'roblox-entry-attributes': metadata.getAttributesJSON(),
                'roblox-entry-userids': metadata.getUserIdsJSON(),
            }
        }).then((response) => {
            const createdTime: string = response.data.objectCreatedTime;
            const updatedTime: string = response.data.createdTime;
            const version: string = response.data.version;
            const attributes: string = metadata.getAttributesJSON();
            const userIds: string = metadata.getUserIdsJSON();
            const keyInfo: DataStoreKeyInfo = new DataStoreKeyInfo(createdTime, updatedTime, version, attributes, userIds);
            return keyInfo;
        }).catch((error) => {
            throw OpenCloudError.fromResponse(error?.response);
        });
    }

    async removeAsync(key: string): Promise<boolean> {
        return this.universe.client.delete(this.path + '/datastore/entries/entry', {
            params: {
                datastoreName: this.name,
                entryKey: key,
                scope: this.scope,
            },
        }).then(() => {
            return true;
        }).catch((error) => {
            const errorObject: OpenCloudError = OpenCloudError.fromResponse(error?.response);
            if (errorObject.type === 'NOT_FOUND') {
                return false;
            }
            throw errorObject;
        });
    }

    async incrementAsync(key: string, incrementBy?: number, metadata: DataStoreKeyMetadata = new DataStoreKeyMetadata()): Promise<[any, DataStoreKeyInfo]> {
        return this.universe.client.post(this.path + '/datastore/entries/entry/increment', {}, {
            params: {
                datastoreName: this.name,
                entryKey: key,
                incrementBy: incrementBy,
                scope: this.scope,
            },
            headers: {
                'roblox-entry-attributes': metadata.getAttributesJSON(),
                'roblox-entry-userids': metadata.getUserIdsJSON(),
            }
        }).then((response): [any, DataStoreKeyInfo] => {
            this.#errorOnInvalidMD5(response?.headers['content-md5'], response.data);
            const createdTime: string = response.headers['roblox-entry-created-time'];
            const updatedTime: string = response.headers['roblox-entry-version-created-time'];
            const version: string = response.headers['roblox-entry-version'];
            const attributes: string = response.headers['roblox-entry-attributes'];
            const userIds: string = response.headers['roblox-entry-userids'];
            const keyInfo: DataStoreKeyInfo = new DataStoreKeyInfo(createdTime, updatedTime, version, attributes, userIds);
            return [response.data, keyInfo];
        }).catch((error) => {
            throw OpenCloudError.fromResponse(error?.response);
        });
    }

    async listKeysAsync(pageSize: number = 250, allScopes: boolean = false, prefix?: string): Promise<DataStoreKeyPages> {
        const pages = new DataStoreKeyPages(this, pageSize, allScopes, prefix);
        await pages.advanceToNextPageAsync();
        return pages;
    }

    #errorOnInvalidMD5(md5: string, content: any): void {
        if (!validateMD5(md5, content)) {
            throw new OpenCloudError('INVALID_MD5', 'The MD5 checksum was invalid.');
        };
    }
    
}