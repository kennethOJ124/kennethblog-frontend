import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getArticle, createArticle, updateArticle } from "../api/articles";
import { getCategories, createCategory } from "../api/categories";
import { createCommentaire } from "../api/commentaires";
import api from "../api/axios";

function ArticleForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [categorieId, setCategorieId] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  const [commentaireTexte, setCommentaireTexte] = useState("");
  const [mediaNom, setMediaNom] = useState("");
  const [mediaFichier, setMediaFichier] = useState(null);

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data));

    if (isEdit) {
      getArticle(id).then((res) => {
        setTitre(res.data.titre);
        setContenu(res.data.contenu);
        setCategorieId(res.data.categorie_id);
      });
    }
  }, [id]);

  const handleCategorySelect = (e) => {
    const value = e.target.value;
    if (value === "__new__") {
      setShowNewCategory(true);
      setCategorieId("");
    } else {
      setShowNewCategory(false);
      setCategorieId(value);
    }
  };

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    setCreatingCategory(true);
    createCategory({ nom: newCategoryName })
      .then((res) => {
        const newCat = res.data;
        setCategories((prev) => [...prev, newCat]);
        setCategorieId(newCat.id);
        setShowNewCategory(false);
        setNewCategoryName("");
        setCreatingCategory(false);
      })
      .catch(() => {
        setError("Impossible de créer cette catégorie.");
        setCreatingCategory(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const data = { titre, contenu, categorie_id: categorieId };
    const action = isEdit ? updateArticle(id, data) : createArticle(data);

    action
      .then(async (res) => {
        const articleId = isEdit ? id : res.data.id;

        // Commentaire optionnel, seulement à la création
        if (!isEdit && commentaireTexte.trim()) {
          await createCommentaire({ contenu: commentaireTexte, article_id: articleId });
        }

        // Média optionnel, seulement à la création
        if (!isEdit && mediaFichier) {
          const formData = new FormData();
          formData.append("nom", mediaNom || "Média");
          formData.append("article_id", articleId);
          formData.append("fichier", mediaFichier);
          await api.post("/medias", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }

        navigate(`/blog/articles/${articleId}`);
      })
      .catch(() => {
        setError("Vérifie les champs : titre, contenu et catégorie sont obligatoires.");
        setSaving(false);
      });
  };

  return (
    <div>
      <h1>{isEdit ? "Modifier l'article" : "Créer un article"}</h1>
      {error && <p className="error-msg">{error}</p>}
      <div className="form-card">
        <form onSubmit={handleSubmit} className="form">
          <label>Titre</label>
          <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} required />

          <label>Catégorie</label>
          <select value={showNewCategory ? "__new__" : categorieId} onChange={handleCategorySelect} required={!showNewCategory}>
            <option value="">-- Choisir --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nom}</option>
            ))}
            <option value="__new__">+ Créer une nouvelle catégorie</option>
          </select>

          {showNewCategory && (
            <div className="inline-category-creator">
              <input
                type="text"
                placeholder="Nom de la nouvelle catégorie"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <button type="button" onClick={handleCreateCategory} disabled={creatingCategory} className="btn-secondary-sm">
                {creatingCategory ? "..." : "Ajouter"}
              </button>
            </div>
          )}

          <label>Contenu</label>
          <textarea value={contenu} onChange={(e) => setContenu(e.target.value)} rows={8} required />

          {!isEdit && (
            <>
              <label>Premier commentaire (optionnel)</label>
              <textarea
                value={commentaireTexte}
                onChange={(e) => setCommentaireTexte(e.target.value)}
                rows={3}
                placeholder="Laisser un commentaire de lancement..."
              />

              <label>Média (optionnel)</label>
              <input
                type="text"
                placeholder="Nom du média"
                value={mediaNom}
                onChange={(e) => setMediaNom(e.target.value)}
                style={{ marginBottom: "10px" }}
              />
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setMediaFichier(e.target.files[0])}
              />
            </>
          )}

          <button type="submit" disabled={saving}>
            {saving ? "Enregistrement..." : isEdit ? "Enregistrer" : "Publier"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ArticleForm;