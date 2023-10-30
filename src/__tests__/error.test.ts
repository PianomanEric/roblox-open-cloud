import { OpenCloudErrorCode } from '../OpenCloudErrorCode';

test('enum lookup', () => {
    const errorName: string = 'NOT_FOUND';
    expect(Object.values<string>(OpenCloudErrorCode).includes(errorName)).toBe(true);
});

test('nonexistant enum lookup', () => {
    const errorName: string = 'I_DO_NOT_EXIST';
    expect(Object.values<string>(OpenCloudErrorCode).includes(errorName)).toBe(false);
});