import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import ArticleList from "./components/ArticleList";
import ArticleDetail from "./components/ArticleDetail";
import ArticleForm from "./components/ArticleForm";
import MediaUploadForm from "./components/MediaUploadForm";
import CategoryList from "./components/CategoryList";
import CategoryForm from "./components/CategoryForm";
import Login from "./components/Login";
import Contact from "./components/Contact";


function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<ArticleList />} />
          <Route path="/blog/articles/nouveau" element={<ArticleForm />} />
          <Route path="/blog/articles/:id" element={<ArticleDetail />} />
          <Route path="/blog/articles/:id/modifier" element={<ArticleForm />} />
          <Route path="/blog/articles/:id/media" element={<MediaUploadForm />} />
          <Route path="/blog/categories" element={<CategoryList />} />
          <Route path="/blog/categories/nouvelle" element={<CategoryForm />} />
          <Route path="/blog/categories/:id/modifier" element={<CategoryForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </>
  );
}

export default App;