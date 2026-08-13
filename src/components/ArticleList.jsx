import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getArticles, deleteArticle, likeArticle, unlikeArticle } from "../api/articles";
import { useAuth } from "../context/AuthContext";
import { Helmet } from "react-helmet-async";

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const hasLiked = (id) => {
    const liked = JSON.parse(localStorage.getItem("likedArticles") || "[]");
    return liked.includes(id);
  };

  const toggleLike = (id) => {
    const liked = JSON.parse(localStorage.getItem("likedArticles") || "[]");

    if (liked.includes(id)) {
      unlikeArticle(id).then((res) => {
        setArticles((prev) =>
          prev.map((a) => (a.id === id ? { ...a, likes: res.data.likes } : a))
        );
        localStorage.setItem("likedArticles", JSON.stringify(liked.filter((x) => x !== id)));
      });
    } else {
      likeArticle(id).then((res) => {
        setArticles((prev) =>
          prev.map((a) => (a.id === id ? { ...a, likes: res.data.likes } : a))
        );
        localStorage.setItem("likedArticles", JSON.stringify([...liked, id]));
      });
    }
  };

  useEffect(() => {
    getArticles()
      .then((response) => {
        setArticles(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger les articles.");
        setLoading(false);
      });
  }, []);

  const searchResults = searchQuery.trim()
    ? articles.filter((a) =>
        a.titre.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectArticle = (articleId) => {
    setSearchQuery("");
    setShowResults(false);
    navigate(`/blog/articles/${articleId}`);
  };

  if (loading) return <p>Chargement des articles...</p>;
  if (error) return <p>{error}</p>;

  const handleDelete = (id) => {
  if (window.confirm("Supprimer cet article définitivement ?")) {
    deleteArticle(id).then(() => {
      setArticles((prev) => prev.filter((a) => a.id !== id));
    });
  }
};
  
  return (
  <div>
    <Helmet>
      <title>Les articles — KennethBlog</title>
      <meta name="description" content="Parcourez tous les articles publiés sur KennethBlog." />
    </Helmet>

    <div className="page-header">
      <h1>Gestion du Blog</h1>
      <div className="header-links">
        <Link to="/blog/categories" className="manage-link">⚙️ Gérer les catégories</Link>
      </div>
    </div>

    <div className="search-card">
      <h2>Gestion des articles</h2>
      <p className="search-hint">Cliquez et tapez l'article que vous recherchez pour l'afficher</p>
      <div className="search-box">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          placeholder="Rechercher un article par titre..."
        />
        {showResults && searchQuery.trim() && (
          <div className="search-results">
            {searchResults.length === 0 && (
              <p className="search-empty">Aucun article trouvé.</p>
            )}
            {searchResults.map((a) => (
              <div
                key={a.id}
                className="search-result-item"
                onClick={() => handleSelectArticle(a.id)}
              >
                {a.titre}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    <div className="list-header">
      <h2>Les articles</h2>
      {user && <Link to="/blog/articles/nouveau" className="btn-bubble">+ Nouvel article</Link>}
    </div>
    {articles.length === 0 && <p className="empty">Aucun article pour le moment.</p>}
    <div className="article-grid">
      {articles.map((article) => (
        <div key={article.id} className={`article-card accent-${article.categorie_id % 6}`}>
          <span className="card-tag">{article.categorie?.nom}</span>
          <h2>
            <Link to={`/blog/articles/${article.id}`}>{article.titre}</Link>
          </h2>
          <p>{article.contenu.substring(0, 120)}...</p>
          <div className="card-meta">
            <span>💬 {article.commentaires.length}</span>
            <span>🖼️ {article.medias.length}</span>
          </div>
          <button
            onClick={() => toggleLike(article.id)}
            className={`like-btn ${hasLiked(article.id) ? "liked" : ""}`}
          >
            {hasLiked(article.id) ? "❤️" : "🤍"} {article.likes}
          </button>
        {user && (  
          <div className="card-actions">
            <Link to={`/blog/articles/${article.id}/modifier`} className="btn-secondary-sm">Modifier</Link>
            <button onClick={() => handleDelete(article.id)} className="btn-danger-sm">Supprimer</button>
          </div>
        )}  
        </div>
      ))}
    </div>
  </div>
 );
}

export default ArticleList;