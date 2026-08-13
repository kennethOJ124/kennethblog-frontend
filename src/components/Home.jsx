import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getArticles } from "../api/articles";
import { getCategories } from "../api/categories";
import { Helmet } from "react-helmet-async";

function Home() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getArticles(), getCategories()]).then(([articlesRes, categoriesRes]) => {
      setArticles(articlesRes.data);
      setCategories(categoriesRes.data);
      setLoading(false);
    });
  }, []);

  const totalCommentaires = articles.reduce((sum, a) => sum + a.commentaires.length, 0);
  const derniersArticles = [...articles]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

  return (
    <div>
      <Helmet>
        <title>KennethBlog — Accueil</title>
        <meta name="description" content="Retrouvez tous les articles de KennethBlog : émotions, voyages, sport, musique et plus encore." />
      </Helmet>

      <div className="hero hero-full">
        <h1>Bienvenue sur KennethBlog 👋</h1>
        <p>Retrouvez ici tous nos articles : émotions, voyages, sport, musique et plus encore.</p>
        <Link to="/blog" className="hero-btn">Voir les articles →</Link>
      </div>

      {!loading && (
        <>
          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-number">{articles.length}</span>
              <span className="stat-label">Articles</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{categories.length}</span>
              <span className="stat-label">Catégories</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{totalCommentaires}</span>
              <span className="stat-label">Commentaires</span>
            </div>
          </div>

          <h3 className="section-title">Derniers articles</h3>
          <div className="article-grid">
            {derniersArticles.map((article) => (
              <div key={article.id} className={`article-card accent-${article.categorie_id % 6}`}>
                <span className="card-tag">{article.categorie?.nom}</span>
                <h2>
                  <Link to={`/blog/articles/${article.id}`}>{article.titre}</Link>
                </h2>
                <p>{article.contenu.substring(0, 100)}...</p>
              </div>
            ))}
          </div>

          <h3 className="section-title">Catégories</h3>
          <div className="category-pills">
            {categories.map((cat) => (
              <Link key={cat.id} to="/blog" className="category-pill">
                {cat.nom}
              </Link>
            ))}
          </div>
        </>
      )}

      <footer className="site-footer">
        <p>© 2026 KennethBlog — Tous droits réservés</p>
        <div style={{ display: "flex", gap: "16px" }}>
          <Link to="/blog">Voir les articles →</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </footer>
    </div>
  );
}

export default Home;