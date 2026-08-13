import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    login(email, password)
      .then(() => navigate("/blog"))
      .catch(() => setError("Email ou mot de passe incorrect."));
  };

  return (
    <div>
      <h1>Connexion</h1>
      {error && <p className="error-msg">{error}</p>}
      <div className="form-card">
        <form onSubmit={handleSubmit} className="form">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Mot de passe</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Se connecter</button>
        </form>
      </div>
    </div>
  );
}

export default Login;