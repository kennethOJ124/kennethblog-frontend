import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories, deleteCategory } from "../api/categories";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then((res) => {
      setCategories(res.data);
      setLoading(false);
    });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Supprimer cette catégorie ?")) {
      deleteCategory(id).then(() => {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      });
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <Link to="/blog" className="back-link">← Retour au blog</Link>
      <div className="list-header">
        <h1>Gérer les catégories</h1>
        <Link to="/blog/categories/nouvelle" className="btn-bubble">+ Nouvelle catégorie</Link>
      </div>

      {categories.length === 0 && <p className="empty">Aucune catégorie pour le moment.</p>}

      <div className="category-list">
        {categories.map((cat) => (
          <div key={cat.id} className="category-row">
            <span>{cat.nom}</span>
            <div className="card-actions">
              <Link to={`/blog/categories/${cat.id}/modifier`} className="btn-secondary-sm">Modifier</Link>
              <button onClick={() => handleDelete(cat.id)} className="btn-danger-sm">Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryList;