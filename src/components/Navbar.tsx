import { useEffect, useState } from "react";
import { uploadFile, type Photo } from "../api/auth";
import { toast } from "react-toastify";

type NavbarProps = {
  onLogout: () => void;
  onUploadSuccess: (photo: Photo) => void;
}

const Navbar = ({ onLogout, onUploadSuccess }: NavbarProps) => {
  // const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
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

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadFile(formData);
      const uploadedPhoto: Photo = response.data.uploaded_file;
      console.log("response data from upload photo ", uploadedPhoto);
      onUploadSuccess(uploadedPhoto);

      toast.success("Upload successful");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow flex justify-between items-center px-6 py-4">

      <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Album</h1>
      <div className="flex gap-4 items-center">
        <button
          onClick={() => setDark(!dark)}
          className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm"
        >
          {dark ? "☀️" : "🌙"}
        </button>
        <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg">
          Upload
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange} />

        </label>
        <button onClick={onLogout} className="text-red-500 cursor-pointer">Logout</button>
      </div>
    </header>
  );
};

export default Navbar;