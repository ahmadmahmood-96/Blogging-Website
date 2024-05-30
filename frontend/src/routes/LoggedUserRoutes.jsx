import { Routes, Route } from "react-router-dom";

import PageNotFound from "../pages/PageNotFound";
import AddBlog from "../pages/AddBlog";
import EditBlogs from "../pages/EditBlogs";
import Dashboard from "../pages/Dashboard";
import Blogs from "../pages/Blogs";
import BlogDetail from "../pages/BlogDetail";

const HomeRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" index element={<Blogs />} />
        <Route path="/:id" index element={<BlogDetail />} />
        <Route path="/edit-blog" index element={<EditBlogs />} />
        <Route path="/dashboard" index element={<Dashboard />} />
        <Route path="/add-blog" index element={<AddBlog />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default HomeRoutes;
