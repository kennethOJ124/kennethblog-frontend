import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function MediaUploadForm() {
  const { id } = useParams(); // id de l'article
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [fichier, setFichier] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const formData = new FormData();
    formData.append("nom", nom);
    formData.append("article_id", id);
    formData.append("fichier", fichier);

    api.post("/medias", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(() => navigate(`/blog/articles/${id}`))
      .catch(() => {
        setError("Vérifie le nom et le fichier (image jpg/png/webp, max 2 Mo).");
        setSaving(false);
      });
  };

  return (
    <div>
      <h1>Ajouter un média</h1>
      {error && <p className="error-msg">{error}</p>}
     <div className="form-card">
      <form onSubmit={handleSubmit} className="form">
        <label>Nom du média</label>
        <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required />

        <label>Fichier image</label>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFichier(e.target.files[0])}
          required
        />

        <button type="submit" disabled={saving}>
          {saving ? "Envoi..." : "Uploader"}
        </button>
      </form>
     </div> 
    </div>
  );
}

export default MediaUploadForm;