import { AxiosResponse } from "axios";

export class OpenCloudError {
    
    type: string;
    message: string;

    constructor(type: string, message: string) {
        this.type = type;
        this.message = message;
    }

    static fromResponse(response: AxiosResponse): OpenCloudError {
        if (response?.data !== null) {
            if (typeof response?.data === 'object') {
                if (response?.data?.error && response?.data?.message) {
                    return new OpenCloudError(response.data.error, response.data.message);
                } else if (response?.data?.code && response?.data?.message) {
                    return new OpenCloudError(response.data.code, response.data.message);
                }
            } else if (response?.data === 'Invalid API Key.') {
                return new OpenCloudError('INVALID_API_KEY', 'The provided API key was invalid or the IP was rejected.');
            } else if (response?.status === 412) {
                return new OpenCloudError('PRECONDITION_FAILED', 'One of the preconditions was not met.')
            }
        }
        return new OpenCloudError('UNKNOWN', 'An unknown error occurred.');
    }

}