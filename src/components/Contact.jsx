import { useState } from "react";
import { Helmet } from "react-helmet-async";

function Contact() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [envoye, setEnvoye] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnvoye(true);
  };

  return (
    <div>
      <Helmet>
        <title>Contact — KennethBlog</title>
        <meta name="description" content="Contactez l'équipe de KennethBlog pour toute question ou suggestion." />
      </Helmet>

      <div className="page-header">
        <h1>Contactez-nous</h1>
        <p className="search-hint">Une question, une suggestion ? Écrivez-nous.</p>
      </div>

      {envoye ? (
        <div className="form-card">
          <p>✅ Merci, votre message a bien été noté !</p>
        </div>
      ) : (
        <div className="form-card">
          <form onSubmit={handleSubmit} className="form">
            <label>Nom</label>
            <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required />

            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label>Message</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} required />

            <button type="submit">Envoyer</button>
          </form>
        </div>
      )}

      <div className="contact-info">
        <div className="contact-item">📧 contact@kennethblog.com</div>
        <div className="contact-item">📍 Cotonou, Bénin</div>
      </div>
    </div>
  );
}

export default Contact;