/*
export class OpenCloudErrorCode {
    public static readonly INVALID_ARGUMENT = new OpenCloudErrorCode("INVALID_ARGUMENT")
    public static readonly INVALID_ARGUMENT = new OpenCloudErrorCode("INVALID_ARGUMENT")

    readonly code: string;

    private constructor (code: string) {
        this.code = code;
    }

    public static fromString(code: string) : OpenCloudErrorCode|undefined {
        if (OpenCloudErrorCode[code]) {
            return OpenCloudErrorCode[code];
        }
    }
}
*/

export enum OpenCloudErrorCode {
    INVALID_ARGUMENT = "INVALID_ARGUMENT",
    INSUFFICIENT_SCOPE = "INSUFFICIENT_SCOPE",
    PERMISSION_DENIED = "PERMISSION_DENIED",
    NOT_FOUND = "NOT_FOUND",
    ABORTED = "ABORTED",
    RESOURCE_EXHAUSTED = "RESOURCE_EXHAUSTED",
    CANCELLED = "CANCELLED",
    INTERNAL = "INTERNAL",
    NOT_IMPLEMENTED = "NOT_IMPLEMENTED",
    UNAVAILABLE = "UNAVAILABLE",
}