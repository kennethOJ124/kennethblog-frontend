import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getArticle, deleteArticle, likeArticle, unlikeArticle } from "../api/articles";
import {
  createCommentaire,
  updateCommentaire,
  deleteCommentaire,
  likeCommentaire,
  unlikeCommentaire,
} from "../api/commentaires";
import { useAuth } from "../context/AuthContext";
import { Helmet } from "react-helmet-async";


function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [nouveauCommentaire, setNouveauCommentaire] = useState("");
  const [sendingComment, setSendingComment] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editingTexte, setEditingTexte] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const [replyingId, setReplyingId] = useState(null);
  const [replyTexte, setReplyTexte] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    getArticle(id)
      .then((response) => {
        setArticle(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Article introuvable.");
        setLoading(false);
      });
  }, [id]);

  // --- Like article ---
  const hasLikedArticle = () => {
    const liked = JSON.parse(localStorage.getItem("likedArticles") || "[]");
    return liked.includes(Number(id));
  };

  const toggleLikeArticle = () => {
    const liked = JSON.parse(localStorage.getItem("likedArticles") || "[]");
    const articleId = Number(id);
    const action = liked.includes(articleId) ? unlikeArticle(id) : likeArticle(id);

    action.then((res) => {
      setArticle((prev) => ({ ...prev, likes: res.data.likes }));
      const updated = liked.includes(articleId)
        ? liked.filter((x) => x !== articleId)
        : [...liked, articleId];
      localStorage.setItem("likedArticles", JSON.stringify(updated));
    });
  };

  // --- Like commentaire ---
  const hasLikedComment = (commentId) => {
    const liked = JSON.parse(localStorage.getItem("likedComments") || "[]");
    return liked.includes(commentId);
  };

  const toggleLikeComment = (commentId, isReply, parentId) => {
    const liked = JSON.parse(localStorage.getItem("likedComments") || "[]");
    const action = liked.includes(commentId) ? unlikeCommentaire(commentId) : likeCommentaire(commentId);

    action.then((res) => {
      setArticle((prev) => ({
        ...prev,
        commentaires: prev.commentaires.map((c) => {
          if (!isReply && c.id === commentId) return { ...c, likes: res.data.likes };
          if (isReply && c.id === parentId) {
            return {
              ...c,
              reponses: c.reponses.map((r) =>
                r.id === commentId ? { ...r, likes: res.data.likes } : r
              ),
            };
          }
          return c;
        }),
      }));
      const updated = liked.includes(commentId)
        ? liked.filter((x) => x !== commentId)
        : [...liked, commentId];
      localStorage.setItem("likedComments", JSON.stringify(updated));
    });
  };

  const handleDelete = () => {
    if (window.confirm("Supprimer cet article définitivement ?")) {
      deleteArticle(id).then(() => navigate("/blog"));
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!nouveauCommentaire.trim()) return;
    setSendingComment(true);
    createCommentaire({ contenu: nouveauCommentaire, article_id: id })
      .then((res) => {
        setArticle((prev) => ({
          ...prev,
          commentaires: [...prev.commentaires, { ...res.data, reponses: [] }],
        }));
        setNouveauCommentaire("");
        setSendingComment(false);
      })
      .catch(() => setSendingComment(false));
  };

  const startEdit = (commentaire) => {
    setEditingId(commentaire.id);
    setEditingTexte(commentaire.contenu);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTexte("");
  };

  const saveEdit = (commentaireId) => {
    if (!editingTexte.trim()) return;
    setSavingEdit(true);
    updateCommentaire(commentaireId, { contenu: editingTexte })
      .then((res) => {
        setArticle((prev) => ({
          ...prev,
          commentaires: prev.commentaires.map((c) => {
            if (c.id === commentaireId) return { ...c, contenu: res.data.contenu };
            return {
              ...c,
              reponses: c.reponses.map((r) =>
                r.id === commentaireId ? { ...r, contenu: res.data.contenu } : r
              ),
            };
          }),
        }));
        setEditingId(null);
        setEditingTexte("");
        setSavingEdit(false);
      })
      .catch(() => setSavingEdit(false));
  };

  const handleDeleteComment = (commentaireId, isReply, parentId) => {
    if (!window.confirm("Supprimer ce commentaire ?")) return;
    deleteCommentaire(commentaireId).then(() => {
      setArticle((prev) => ({
        ...prev,
        commentaires: isReply
          ? prev.commentaires.map((c) =>
              c.id === parentId
                ? { ...c, reponses: c.reponses.filter((r) => r.id !== commentaireId) }
                : c
            )
          : prev.commentaires.filter((c) => c.id !== commentaireId),
      }));
    });
  };

  const startReply = (commentId) => {
    setReplyingId(commentId);
    setReplyTexte("");
  };

  const cancelReply = () => {
    setReplyingId(null);
    setReplyTexte("");
  };

  const submitReply = (parentId) => {
    if (!replyTexte.trim()) return;
    setSendingReply(true);
    createCommentaire({ contenu: replyTexte, article_id: id, parent_id: parentId })
      .then((res) => {
        setArticle((prev) => ({
          ...prev,
          commentaires: prev.commentaires.map((c) =>
            c.id === parentId ? { ...c, reponses: [...c.reponses, res.data] } : c
          ),
        }));
        setReplyingId(null);
        setReplyTexte("");
        setSendingReply(false);
      })
      .catch(() => setSendingReply(false));
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Helmet>
        <title>{article.titre} — KennethBlog</title>
        <meta name="description" content={article.contenu.substring(0, 150)} />
      </Helmet>

      <Link to="/blog" className="back-link">← Retour aux articles</Link>

      <div className="article-header-card">
        <div className="article-header-top">
          <h1>{article.titre}</h1>
          {user && (
            <div className="actions">
              <Link to={`/blog/articles/${id}/modifier`} className="btn-secondary">Modifier</Link>
              <button onClick={handleDelete} className="btn-danger">Supprimer</button>
            </div>
          )}
        </div>
        {article.categorie && <span className="categorie-tag">{article.categorie.nom}</span>}
      </div>

      <button onClick={toggleLikeArticle} className={`like-btn ${hasLikedArticle() ? "liked" : ""}`}>
        {hasLikedArticle() ? "❤️" : "🤍"} {article.likes} j'aime
      </button>

      <p className="contenu">{article.contenu}</p>

      <h3 className="section-title">Médias</h3>
      {article.medias.length === 0 && <p className="empty">Aucun média.</p>}
      {article.medias.map((media) => {
        const isVideo = /\.(mp4|mov|webm)$/i.test(media.url);
        return (
          <div key={media.id} className="media">
            <p>{media.nom}</p>
            {isVideo ? (
              <video src={`http://localhost:8000${media.url}`} controls style={{ maxWidth: "100%", borderRadius: "8px" }} />
            ) : (
              <img src={`http://localhost:8000${media.url}`} alt={media.nom} style={{ maxWidth: "100%", borderRadius: "8px" }} />
            )}
          </div>
        );
      })}
      {user && <Link to={`/blog/articles/${id}/media`} className="btn-bubble">+ Ajouter un média</Link>}

      <h3 className="section-title">Commentaires</h3>
      {article.commentaires.length === 0 && <p className="empty">Aucun commentaire.</p>}

      {article.commentaires.map((commentaire) => (
        <div key={commentaire.id} className="commentaire">
          {editingId === commentaire.id ? (
            <div className="comment-edit">
              <textarea value={editingTexte} onChange={(e) => setEditingTexte(e.target.value)} rows={2} />
              <div className="comment-edit-actions">
                <button onClick={() => saveEdit(commentaire.id)} disabled={savingEdit} className="btn-secondary-sm">
                  {savingEdit ? "..." : "Enregistrer"}
                </button>
                <button onClick={cancelEdit} className="btn-secondary-sm">Annuler</button>
              </div>
            </div>
          ) : (
            <div className="comment-view">
              <p>{commentaire.contenu}</p>
              <div className="comment-actions">
                <button
                  onClick={() => toggleLikeComment(commentaire.id, false, null)}
                  className={`btn-link-sm ${hasLikedComment(commentaire.id) ? "liked-text" : ""}`}
                >
                  {hasLikedComment(commentaire.id) ? "❤️" : "🤍"} {commentaire.likes}
                </button>
                <button onClick={() => startReply(commentaire.id)} className="btn-link-sm">Répondre</button>
                <button onClick={() => startEdit(commentaire)} className="btn-link-sm">Modifier</button>
                <button onClick={() => handleDeleteComment(commentaire.id, false, null)} className="btn-link-sm btn-link-danger">Supprimer</button>
              </div>
            </div>
          )}

          {replyingId === commentaire.id && (
            <div className="reply-form">
              <textarea
                value={replyTexte}
                onChange={(e) => setReplyTexte(e.target.value)}
                placeholder="Votre réponse..."
                rows={2}
              />
              <div className="comment-edit-actions">
                <button onClick={() => submitReply(commentaire.id)} disabled={sendingReply} className="btn-secondary-sm">
                  {sendingReply ? "..." : "Répondre"}
                </button>
                <button onClick={cancelReply} className="btn-secondary-sm">Annuler</button>
              </div>
            </div>
          )}

          {commentaire.reponses && commentaire.reponses.length > 0 && (
            <div className="reply-list">
              {commentaire.reponses.map((reponse) => (
                <div key={reponse.id} className="commentaire reply-item">
                  {editingId === reponse.id ? (
                    <div className="comment-edit">
                      <textarea value={editingTexte} onChange={(e) => setEditingTexte(e.target.value)} rows={2} />
                      <div className="comment-edit-actions">
                        <button onClick={() => saveEdit(reponse.id)} disabled={savingEdit} className="btn-secondary-sm">
                          {savingEdit ? "..." : "Enregistrer"}
                        </button>
                        <button onClick={cancelEdit} className="btn-secondary-sm">Annuler</button>
                      </div>
                    </div>
                  ) : (
                    <div className="comment-view">
                      <p>{reponse.contenu}</p>
                      <div className="comment-actions">
                        <button
                          onClick={() => toggleLikeComment(reponse.id, true, commentaire.id)}
                          className={`btn-link-sm ${hasLikedComment(reponse.id) ? "liked-text" : ""}`}
                        >
                          {hasLikedComment(reponse.id) ? "❤️" : "🤍"} {reponse.likes}
                        </button>
                        <button onClick={() => startEdit(reponse)} className="btn-link-sm">Modifier</button>
                        <button onClick={() => handleDeleteComment(reponse.id, true, commentaire.id)} className="btn-link-sm btn-link-danger">Supprimer</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <form onSubmit={handleAddComment} className="comment-form">
        <textarea
          value={nouveauCommentaire}
          onChange={(e) => setNouveauCommentaire(e.target.value)}
          placeholder="Ajouter un commentaire..."
          rows={3}
        />
        <button type="submit" disabled={sendingComment}>
          {sendingComment ? "Envoi..." : "Commenter"}
        </button>
      </form>
    </div>
  );
}

export default ArticleDetail;