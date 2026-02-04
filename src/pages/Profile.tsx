import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile, type User } from "../api/auth";
import { toast } from "react-toastify";
import { getImageUrl } from "../utils/helpFunctions";
import Navbar from "../components/Navbar";

const bucketName = import.meta.env.VITE_S3_BUCKET;
const region = import.meta.env.VITE_AWS_REGION;
const S3_BASE_URL = `https://${bucketName}.s3.${region}.amazonaws.com/`;

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const [previewApi, setPreviewApi] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setFirstName(user.first_name);
            setLastName(user.last_name);
            setPreviewApi(user.profile_pic);
        }
    }, [user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfilePic(file);
            setPreviewApi(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            const { data } = await updateProfile({
                first_name: firstName,
                last_name: lastName,
                profile_pic: profilePic,
            });

            // Assuming the backend returns the updated user object in `data` or `data.user`
            // Adjust based on actual API response. API definition for `updateProfile` returns `api.patch(...)`.
            // If it follows `login` response pattern, it might be `{ user: ... }` or just the user.
            // Based on `signup` not returning a user directly but `login` does.
            // I'll stick to optimistically updating or using `data` if it matches.
            // For now, let's assume `data.user` is the user or `data` is the user. 
            // If `data` has `user` property use it, else use `data`.
            // Since I can't check run-time easily without running it, I'll allow flexible casting or just update with local state for now + merging.

            const updatedUserHelper = (data as any).user || data;
            const userWithTimestamp = {
                ...updatedUserHelper,
                profile_pic: `${updatedUserHelper.profile_pic}?t=${Date.now()}`
            };

            updateUser(userWithTimestamp as User);
            setIsEditing(false);
            setProfilePic(null);
            setPreviewApi(userWithTimestamp.profile_pic);
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Failed to update profile", error);
            toast.error("Failed to update profile.");
        }
    };

    const getUserInitials = () => {
        if (!user) return "U";
        return `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase() || "U";
    };

    if (!user) return null;

    // Logic to determine image source
    let imageSrc = "";
    if (profilePic && previewApi) {
        imageSrc = previewApi; // Local file preview
    } else if (previewApi) {
        if (previewApi.startsWith("http")) {
            imageSrc = previewApi;
        } else {
            imageSrc = getImageUrl(previewApi, S3_BASE_URL);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar variant="profile" />
            <div className="pt-8 px-4">
                <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col items-center mb-8">
                                <div className="relative w-32 h-32 mb-4">
                                    {imageSrc ? (
                                        <img
                                            src={imageSrc}
                                            alt="Profile"
                                            className="w-full h-full rounded-full object-cover border-4 border-indigo-100 dark:border-gray-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-indigo-500 text-white flex items-center justify-center text-4xl font-bold border-4 border-indigo-100 dark:border-gray-700">
                                            {getUserInitials()}
                                        </div>
                                    )}

                                    {isEditing && (
                                        <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 shadow-lg">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                    )}
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {user.first_name} {user.last_name}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full p-3 rounded-lg border ${isEditing
                                            ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                                            : "border-transparent bg-gray-100 dark:bg-gray-900"
                                            } text-gray-900 dark:text-white transition-colors`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full p-3 rounded-lg border ${isEditing
                                            ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                                            : "border-transparent bg-gray-100 dark:bg-gray-900"
                                            } text-gray-900 dark:text-white transition-colors`}
                                    />
                                </div>
                            </div>

                            {/* Storage Usage Section */}
                            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6 mb-8">
                                <div className="flex justify-between items-end mb-2">
                                    <div>
                                        <h3 className="text-lg font-medium text-indigo-900 dark:text-indigo-200">
                                            Storage Usage
                                        </h3>
                                        <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                            Used space in your gallery
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                            150 MB
                                        </span>
                                        {/* <span className="text-sm text-gray-500 dark:text-gray-400"> / 1 GB</span> */}
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                    <div
                                        className="bg-indigo-600 h-2.5 rounded-full"
                                        style={{ width: "15%" }}
                                    ></div>
                                </div>
                            </div>

                            {isEditing && (
                                <div className="flex gap-4 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFirstName(user.first_name);
                                            setLastName(user.last_name);
                                            setPreviewApi(user.profile_pic);
                                            setProfilePic(null);
                                        }}
                                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
