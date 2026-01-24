// components/Navbar.tsx
import { useEffect, useState } from "react";

const Navbar = ({ onLogout }: { onLogout: () => void }) => {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

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
          <input type="file" className="hidden" />
        </label>
        <button onClick={onLogout} className="text-red-500">Logout</button>
      </div>
    </header>
  );
};

export default Navbar;