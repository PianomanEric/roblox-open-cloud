export class DataStoreKeyMetadata {
    
    userIds: number[] = [];
    attributes: {} = {};

    getUserIdsJSON(): string {
        return JSON.stringify(this.userIds);
    }

    getAttributesJSON(): string {
        return JSON.stringify(this.attributes);
    }

}