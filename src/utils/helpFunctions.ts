import { type Photo, type User } from "../api/auth";

export const getImageUrl = (key: string, S3_BASE_URL: string) => {
    return `${S3_BASE_URL}${key}`;
};

export const groupPhotosByMonth = (photos: Photo[]): Record<string, Photo[]> => {
    return photos.reduce((groups, photo: Photo) => {
        let key = "Unknown Date";

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


export const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};


export const getImageSrc = (profilePic: File | null, previewApi: string | null, S3_BASE_URL: string) => {
    let imageSrc = "";
    if (profilePic && previewApi) {
        imageSrc = previewApi;
    } else if (previewApi) {
        if (previewApi.startsWith("http")) {
            imageSrc = previewApi;
        } else {
            imageSrc = getImageUrl(previewApi, S3_BASE_URL);
        }
    }
    return imageSrc;
};


export const getUserInitials = (user: User | null) => {
    if (!user) return "U";
    return `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase() || "U";
};