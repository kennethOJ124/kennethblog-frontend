import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCategories, createCategory, updateCategory } from "../api/categories";

function CategoryForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      getCategories().then((res) => {
        const cat = res.data.find((c) => c.id === Number(id));
        if (cat) setNom(cat.nom);
      });
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const action = isEdit ? updateCategory(id, { nom }) : createCategory({ nom });

    action
      .then(() => navigate("/blog/categories"))
      .catch(() => {
        setError("Le nom de la catégorie est obligatoire.");
        setSaving(false);
      });
  };

  return (
    <div>
      <h1>{isEdit ? "Modifier la catégorie" : "Nouvelle catégorie"}</h1>
      {error && <p className="error-msg">{error}</p>}
     <div className="form-card">
      <form onSubmit={handleSubmit} className="form">
        <label>Nom</label>
        <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required />
        <button type="submit" disabled={saving}>
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
     </div> 
    </div>
  );
}

export default CategoryForm;