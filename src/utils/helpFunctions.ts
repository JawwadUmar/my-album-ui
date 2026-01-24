export const getImageUrl = (key: string, S3_BASE_URL:string) => {
    return `${S3_BASE_URL}${key}`;
};