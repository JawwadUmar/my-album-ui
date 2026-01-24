import { useCallback, useState } from "react";
import Navbar from "../components/Navbar";
import PhotoCard from "../components/Phtocard"
import useInfiniteScroll from "../utils/useInfiniteScroll";

const Gallery = () => {
  const [photos, setPhotos] = useState<string[]>([]);

  const loadMore = useCallback(() => {
    const batch = Array.from({ length: 12 }).map(
      () => `https://picsum.photos/400/400?random=${Math.random()}`
    );
    setPhotos((prev) => [...prev, ...batch]);
  }, []);

  const bottomRef = useInfiniteScroll(loadMore);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <Navbar onLogout={logout} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
        {photos.map((src, i) => (
          <PhotoCard key={i} src={src} />
        ))}
      </div>

      <div ref={bottomRef} className="h-10" />
    </div>
  );
};

export default Gallery;
