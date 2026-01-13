import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const DEFAULT_AVATARS = [
  "/avatars/male1.png",
  "/avatars/male2.png",
  "/avatars/female1.png",
  "/avatars/female2.png",
];

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const token = localStorage.getItem("token");
  const loggedInUserId = token ? Number(jwtDecode(token).sub) : null;

  const [user, setUser] = useState(null);
  const [showDoc, setShowDoc] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({});
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedDocument, setUploadedDocument] = useState(null);

  useEffect(() => {
    api
      .get(`/users/${id}`)
      .then((res) => {
        setUser(res.data);
        setForm(res.data);
      })
      .catch(() => navigate("/users"));
  }, [id, navigate]);

  if (!user) return <div className="p-6">Loading...</div>;
  

  const adminId = 5;

const isAdmin = loggedInUserId === adminId;
const isSelf = loggedInUserId === user.id;

const canEdit = isSelf || isAdmin;
const canDelete =isSelf || isAdmin;



  const profileImage = user.profile_pic
    ? `http://127.0.0.1:5000/uploads/profiles/${user.profile_pic}`
    : DEFAULT_AVATARS[0];

  const documentUrl = user.document
    ? `http://127.0.0.1:5000/uploads/documents/${user.document}`
    : null;

  const urlToFile = async (url) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], "avatar.png", { type: blob.type });
  };

  const handleSave = async () => {
    try {
      await api.put(`/users/${id}`, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        age: form.age,
      });

      const fd = new FormData();

      let profileFile = null;
      if (uploadedImage) profileFile = uploadedImage;
      else if (selectedAvatar) profileFile = await urlToFile(selectedAvatar);
      else if (!user.profile_pic)
        profileFile = await urlToFile(DEFAULT_AVATARS[0]);

      if (profileFile) fd.append("profile_pic", profileFile);
      if (uploadedDocument) fd.append("document", uploadedDocument);

      if (fd.has("profile_pic") || fd.has("document")) {
        await api.post(`/users/${id}/upload`, fd);
      }

      setIsEditing(false);
      window.location.reload();
    } catch {
      alert("Update failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await api.delete(`/users/${id}`);
    navigate("/users", { replace: true });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/users")}
          className="mr-4 p-1 hover:bg-blue-100 rounded-full"
        >
          <img src="/back-arrow.png" className="w-6 h-6" />
        </button>

        <h1 className="flex-1 text-center text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          User Details
        </h1>

        <div className="w-8" />
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        {/* Profile */}
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <img
            src={profileImage}
            className="w-32 h-32 rounded-full object-cover border"
          />
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        {!isEditing ? (
          <>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><strong>Phone:</strong> {user.phone || "—"}</div>
              <div><strong>Age:</strong> {user.age || "—"}</div>
              <div className="md:col-span-2">
                <strong>Address:</strong> {user.address || "—"}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              {documentUrl && (
                <button
                  onClick={() => setShowDoc(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  View Document
                </button>
              )}
              {canEdit && (
  <button
    onClick={() => setIsEditing(true)}
    className="px-4 py-2 bg-green-500 text-white rounded"
  >
    Edit
  </button>
)}

{canDelete && (
  <button
    onClick={handleDelete}
    
    className={`px-4 py-2 rounded ${
    isAdmin && isSelf
      ? "opacity-0 pointer-events-none"
      : "bg-red-500 text-white hover:bg-red-600"
  }`}
  >
    Delete
  </button>
)}

            </div>
          </>
        ) : (
          <>
            {/* Edit Form */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="border p-2 rounded" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="border p-2 rounded" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input className="border p-2 rounded" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input className="border p-2 rounded" value={form.age || ""} onChange={(e) => setForm({ ...form, age: e.target.value })} />
              <textarea className="border p-2 rounded md:col-span-2" value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>

            {/* Upload Section */}
            <div className="mt-6 space-y-5">
              {/* Avatars */}
              <div>
                <p className="font-semibold mb-2">Select Avatar</p>
                <div className="flex gap-4 flex-wrap">
                  {DEFAULT_AVATARS.map((src) => (
                    <img
                      key={src}
                      src={src}
                      onClick={() => {
                        setSelectedAvatar(src);
                        setUploadedImage(null);
                      }}
                      className={`w-16 h-16 rounded-full cursor-pointer border-2 ${
                        selectedAvatar === src
                          ? "border-blue-500 ring-2 ring-blue-300"
                          : "border-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Choose Image */}
              <div>
                <label className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600">
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      setUploadedImage(e.target.files[0]);
                      setSelectedAvatar(null);
                    }}
                  />
                </label>
              </div>

              {/* Image Preview */}
              {(uploadedImage || selectedAvatar) && (
                <img
                  src={
                    uploadedImage
                      ? URL.createObjectURL(uploadedImage)
                      : selectedAvatar
                  }
                  className="w-24 h-24 rounded-full object-cover border"
                />
              )}

              {/* Choose File */}
              <div>
                <label className="inline-flex items-center px-4 py-2 bg-indigo-500 text-white rounded cursor-pointer hover:bg-indigo-600">
                  Choose File
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    hidden
                    onChange={(e) => setUploadedDocument(e.target.files[0])}
                  />
                </label>
                {uploadedDocument && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {uploadedDocument.name}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">
                Save
              </button>
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-400 text-white rounded">
                Cancel
              </button>
            </div>
          </>
        )}
      </div>

      {/* Document Modal */}
      {showDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl h-[80vh] p-4 relative">
            <button
              onClick={() => setShowDoc(false)}
              className="absolute top-2 right-2 text-red-500 font-bold"
            >
              ✕
            </button>
            <iframe src={documentUrl} className="w-full h-full rounded" />
          </div>
        </div>
      )}
    </div>
  );
}
