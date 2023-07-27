import { Universe } from "../Universe";

export class DataStorePages {

    universe: Universe;
    limit: number;
    prefix?: string;
    cursor: string | null = null;
    currentPage: [] | null = null;
    isFinished: boolean = false;
    path: string;

    constructor(universe: Universe, limit: number = 250, prefix?: string) {
        this.universe = universe;
        this.limit = limit;
        this.prefix = prefix;
        this.path = `/datastores/v1/universes/${universe.universeId}/standard-datastores`;
    }

    async advanceToNextPageAsync(): Promise<void> {
        if (this.isFinished) {
            this.currentPage = [];
            return;
        }
        return this.universe.client.get(this.path, {
            params: {
                cursor: this.cursor,
                limit: this.limit,
                prefix: this.prefix,
            }
        }).then((response) => {
            this.currentPage = response.data.datastores;
            this.cursor = response.data.nextPageCursor;
            if (!this.cursor) {
                this.isFinished = true;
            }
        }).catch((error) => {
            throw error;
        });
    }
    
}