import { type Photo } from "../api/auth";

export const getImageUrl = (key: string, S3_BASE_URL: string) => {
    return `${S3_BASE_URL}${key}`;
};

export const groupPhotosByMonth = (photos: Photo[]): Record<string, Photo[]> => {
    return photos.reduce((groups, photo: Photo) => {
        let key = "Unknown Date";

        // Handle inconsistent casing from API (created_at vs CreatedAt)
        // console.log(photo);

        const dateStr: string = photo.created_at;
        if (dateStr) {
            const cleanDateStr = String(dateStr).replace(" ", "T");
            const date = new Date(cleanDateStr);

            // Check if date is valid
            if (!isNaN(date.getTime())) {
                key = date.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                });
            }
        }

        if (!groups[key]) {
            groups[key] = [];
        }

        groups[key].push(photo);
        return groups;
    }, {} as Record<string, Photo[]>);
};