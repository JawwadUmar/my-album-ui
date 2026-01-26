import { useCallback, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import PhotoCard from "../components/Phtocard";
import useInfiniteScroll from "../utils/useInfiniteScroll";
import { getFiles, type GetFilesParams, type Photo } from "../api/auth";
import { getImageUrl } from "../utils/helpFunctions";

const bucketName = import.meta.env.VITE_S3_BUCKET;
const region = import.meta.env.VITE_AWS_REGION;

const S3_BASE_URL = `https://${bucketName}.s3.${region}.amazonaws.com/`;

const Gallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Ref to prevent "stale closures" inside the callback
  const cursorRef = useRef(0);

  const handleUploadSuccess = (photo: Photo) => {
    setPhotos((prev) => [photo, ...prev]);
  };

  const loadMore = useCallback(async () => {
    // Prevent duplicate requests
    if (loading || !hasMore) return;

    setLoading(true);

    const params: GetFilesParams = {
      limit: 12,
      cursor: cursorRef.current || undefined,
    }

    try {

      const response = await getFiles(params)

      const { data, next_cursor } = response.data;
      console.log("The data for photos is = ", data)
      console.log("The next cursor is = ", next_cursor)
      if (data && data.length > 0) {
        setPhotos((prev) => [...prev, ...data]);

        if (next_cursor === 0) {
          setHasMore(false);
        } else {
          cursorRef.current = next_cursor;
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch photos:", error);
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading]); // Dependencies

  const bottomRef = useInfiniteScroll(loadMore);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <Navbar onUploadSuccess={handleUploadSuccess} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.file_id}
            src={getImageUrl(photo.storage_key, S3_BASE_URL)}
          />
        ))}
      </div>

      {/* Loading Indicator at the bottom */}
      <div ref={bottomRef} className="h-20 flex justify-center items-center">
        {loading && <span className="text-gray-500">Loading more...</span>}
        {!hasMore && photos.length > 0 && (
          <span className="text-gray-400 text-sm">You have reached the end.</span>
        )}
      </div>
    </div>
  );
};

export default Gallery;