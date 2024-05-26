import { Routes, Route } from "react-router-dom";

import PageNotFound from "../pages/PageNotFound";
import AddBlog from "../pages/AddBlog";
import Blogs from "../pages/Blogs";

const HomeRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" index element={<Blogs />} />
        <Route path="/add-blog" index element={<AddBlog />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default HomeRoutes;
