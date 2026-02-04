import { useEffect, useState } from "react";
import LoadingModal from "./LoadingModal";
import { uploadFile, type Photo } from "../api/auth";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { getImageUrl } from "../utils/helpFunctions";
import { Link } from "react-router-dom";

const bucketName = import.meta.env.VITE_S3_BUCKET;
const region = import.meta.env.VITE_AWS_REGION;
const S3_BASE_URL = `https://${bucketName}.s3.${region}.amazonaws.com/`;

type NavbarProps = {
  onUploadSuccess?: (photo: Photo) => void;
  variant?: "gallery" | "profile";
}

const Navbar = ({ onUploadSuccess, variant = "gallery" }: NavbarProps) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!onUploadSuccess) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);

    try {
      const response = await uploadFile(formData);
      const uploadedPhoto: Photo = response.data.uploaded_file;
      console.log("response data from upload photo ", uploadedPhoto);
      onUploadSuccess(uploadedPhoto);

      toast.success("Upload successful");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const getUserInitials = () => {
    if (!user) return "U";
    return `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase() || "U";
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow flex justify-between items-center px-6 py-4">

      <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Album</h1>
      <div className="flex gap-4 items-center">
        <button
          onClick={() => setDark(!dark)}
          className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm cursor-pointer"
        >
          {dark ? "☀️" : "🌙"}
        </button>

        {variant === "profile" && (
          <Link
            to="/"
            className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Back to Gallery
          </Link>
        )}

        {variant === "gallery" && (
          <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Upload
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange} />
          </label>
        )}

        {/* User Roundel */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer overflow-hidden"
          >
            {user?.profile_pic ? (
              <img
                src={user.profile_pic.startsWith("http") ? user.profile_pic : getImageUrl(user.profile_pic, S3_BASE_URL)}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              getUserInitials()
            )}
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
              <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-900 dark:text-white font-medium truncate">{user?.first_name} {user?.last_name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
              </div>
              <Link
                to="/profile"
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setShowDropdown(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  setShowDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
          {/* Backdrop to close dropdown on click outside - simple version */}
          {showDropdown && (
            <div onClick={() => setShowDropdown(false)} className="fixed inset-0 z-40 bg-transparent h-full w-full cursor-default" />
          )}
        </div>

      </div>
      <LoadingModal isOpen={isUploading} message="Uploading Photo..." />
    </header>
  );
};

export default Navbar;