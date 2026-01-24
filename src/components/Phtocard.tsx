const PhotoCard = ({ src }: { src: string }) => {
  return (
    <div className="rounded-xl overflow-hidden shadow hover:scale-[1.02] transition">
      <img src={src} className="w-full h-48 object-cover" />
    </div>
  );
};

export default PhotoCard;