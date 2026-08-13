import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const location = useLocation();
  const isBlogPage = location.pathname.startsWith("/blog");
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {isBlogPage ? (
          <Link to="/blog" className="logo-blog">
            <span className="logo-blog-icon">📖</span>
            <span>KennethBlog</span>
          </Link>
        ) : (
          <Link to="/" className="logo-home">
            <span className="logo-home-icon">👋</span>
            <span>Accueil</span>
          </Link>
        )}

        <nav>
          <Link to="/contact" className="nav-link">Contact</Link>  
          <button onClick={toggleTheme} className="theme-toggle" title="Changer de thème">
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {user ? (
            <>
              <span className="navbar-user">{user.name}</span>
              <button onClick={logout} className="btn-link-sm">Déconnexion</button>
            </>
          ) : (
            <Link to="/login">Connexion</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;