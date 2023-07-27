import { createHash } from 'node:crypto';

export const generateMD5 = (content: any): string => {
    return createHash('md5').update(JSON.stringify(content)).digest('base64');
};

export const validateMD5 = (md5: string, content: any): boolean => {
    return md5 === generateMD5(content);
};
