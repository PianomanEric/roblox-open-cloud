export class DataStoreKeyInfo {
    createdTime: string;
    updatedTime: string;
    version: string;
    attributes: object;
    userIds: number[];

    constructor(createdTime: string, updatedTime: string, version: string, attributes: string, userIds: string) {
        this.createdTime = createdTime;
        this.updatedTime = updatedTime;
        this.version = version;
        this.attributes = attributes ? JSON.parse(attributes) : {};
        this.userIds = userIds ? JSON.parse(userIds) : [];
    }
}
