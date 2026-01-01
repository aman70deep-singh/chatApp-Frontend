import { useAuth } from "../context/authContext";
import axiosAuth from "../api/axiosAuth";
import { useState } from "react";

const ProfileModal = ({ onClose }) => {
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [image, setImage] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [loadingPic, setLoadingPic] = useState(false);

  /* ================= UPDATE NAME & BIO ================= */
  const updateProfileInfo = async () => {
    if (name === user.name && bio === user.bio) return;

    try {
      setLoadingInfo(true);
      const res = await axiosAuth.put("/users/profile", { name, bio });
      setUser(res.data.user);

      onClose();
    } catch (err) {
      console.log("Profile info update failed");
    } finally {
      setLoadingInfo(false);
    }
  };

  /* ================= UPDATE PROFILE PIC ================= */
  const updateProfilePic = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("profilePic", image);

    try {
      setLoadingPic(true);
      const res = await axiosAuth.post("/auth/upload-profile-pic", formData);

      const updatedUser = res.data.user || res.data;
      if (!updatedUser) {
        console.error("No user data in response:", res.data);
        return;
      }

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setImage(null);
      onClose();
    } catch (err) {
      console.log("Profile pic upload failed", err);
      if (err.response) {
        console.log("Error response:", err.response.data);
      }
    } finally {
      setLoadingPic(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#202C33] w-full max-w-md rounded-xl p-6 text-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* ================= PROFILE PIC ================= */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={image ? URL.createObjectURL(image) : user.profilePic}
              className="w-24 h-24 rounded-full object-cover border-2 border-green-500"
            />

            {/* Camera Icon */}
            <label className="absolute bottom-1 right-1 bg-green-500 p-2 rounded-full cursor-pointer">
              📷
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
          </div>

          {image && (
            <button
              type="button"
              onClick={updateProfilePic}
              disabled={loadingPic}
              className="mt-3 bg-green-500 px-4 py-1.5 rounded text-sm disabled:opacity-50"
            >
              {loadingPic ? "Updating..." : "Update Photo"}
            </button>
          )}
        </div>

        {/* ================= NAME ================= */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#2A3942] p-2 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        {/* ================= BIO ================= */}
        <div className="mb-6">
          <label className="block text-sm text-gray-300 mb-1">Bio</label>
          <input
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-[#2A3942] p-2 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            Cancel
          </button>

          <button
            onClick={updateProfileInfo}
            disabled={loadingInfo}
            className="bg-green-500 px-4 py-2 rounded disabled:opacity-50"
          >
            {loadingInfo ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
